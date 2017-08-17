#include "pch.h"
#include "wrl/implements.h"
#include <condition_variable>
#include "SineTone.h"

// Values below combine to form an integral number of samples per cycle
#define TONE_FREQ (400.F)
#define SAMPLING_FREQ (48000.F)

#define BUFFER_SIZE_IN_SEC (10)
// Render format
const WAVEFORMATEX renderFormat = { 3, 2, SAMPLING_FREQ, SAMPLING_FREQ * 2 * 4, 2 * 4, 32, 0 };

using namespace std;
using namespace Windows::Media::Devices;
using namespace Microsoft::WRL;

void SineTone::PrepareData(const WAVEFORMATEX *format)
{
	float samplesPerCycle = SAMPLING_FREQ / TONE_FREQ;
	int numCyclesForIntegralSampleCount = (samplesPerCycle - floor(samplesPerCycle)) > 0 ? 1 / (samplesPerCycle - floor(samplesPerCycle)) : 1;

	if (format->wBitsPerSample != 32)
	{
		throw ref new Platform::Exception(E_INVALIDARG);
	}

	_samplesAllocated = samplesPerCycle * numCyclesForIntegralSampleCount;

	int bufferSize = _samplesAllocated * format->nChannels * format->wBitsPerSample / 8;

	_sineToneBuffer.reset(new float[bufferSize]);

	// Fill in the sampled tone
	float *buf = _sineToneBuffer.get();
	for (int c = 0; c < _samplesAllocated; c++)
	{
		float val = sin(2 * 3.124F * TONE_FREQ * c / SAMPLING_FREQ);

		for (int j = 0; j < format->nChannels; j++)
		{
			*buf++ = val;
		}
	}
	_readPtr = _sineToneBuffer.get();
	_blockAlign = format->nChannels * 4;
}

class AudioCompletionHandler WrlSealed : public RuntimeClass< RuntimeClassFlags<WinRtClassicComMix>,
                                         IActivateAudioInterfaceCompletionHandler,
                                         FtmBase>
{
public:

	HRESULT RuntimeClassInitialize(SineTone *player)
	{
		_player = player;
		return S_OK;
	}

	// IActivateAudioInterfaceCompletionHandler
	IFACEMETHOD(ActivateCompleted)(_In_  IActivateAudioInterfaceAsyncOperation *activateOperation)
	{
		HRESULT hrActivate;
		ComPtr<IUnknown> unknown;
		ComPtr<IAudioClient> audioClient;
		HRESULT hr = activateOperation->GetActivateResult(&hrActivate, &unknown);
		if (FAILED(hr)) { throw ref new Platform::Exception(hr); }

		if (FAILED(hrActivate)) { throw ref new Platform::Exception(hrActivate); }

		// Save this pointer in the parent class
		unknown.As(&_player->_audioClient);

		_activateCompleted.notify_all();

		return S_OK;
	}

	void Wait()
	{
		std::unique_lock<std::mutex> lk(_unnecessary);
		_activateCompleted.wait(lk);
	}

	// 
private:
	SineTone *_player = nullptr;
	std::condition_variable _activateCompleted;
	std::mutex _unnecessary;
};

void SineTone::FillBuffer(PBYTE buffer, int frames)
{
	while (frames > 0)
	{
		UINT32 samplesToReadBeforeWrapAround = _samplesAllocated - (_readPtr - _sineToneBuffer.get()) / _blockAlign;
		UINT32 framesToCopy = min(frames, samplesToReadBeforeWrapAround);

		memcpy(buffer, _readPtr, framesToCopy * _blockAlign);

		buffer += framesToCopy * _blockAlign;
		frames -= framesToCopy;
		_readPtr += framesToCopy * _blockAlign;
		if ((_readPtr - _sineToneBuffer.get()) / _blockAlign >= _samplesAllocated)
		{
			_readPtr = _sineToneBuffer.get();
		}
	}
}

void SineTone::Start()
{
	ComPtr<AudioCompletionHandler> audioCompletionHandler;
	HRESULT hr = MakeAndInitialize<AudioCompletionHandler>(&audioCompletionHandler, this);
	if (FAILED(hr)) { throw ref new Platform::Exception(hr); }
	
	ComPtr<IActivateAudioInterfaceCompletionHandler> completionHandler;
	audioCompletionHandler.As(&completionHandler);

	ComPtr<IActivateAudioInterfaceAsyncOperation> activateOperation;
	hr = ::ActivateAudioInterfaceAsync(MediaDevice::GetDefaultAudioRenderId(AudioDeviceRole::Default)->Data(), __uuidof(IAudioClient), nullptr, completionHandler.Get(), &activateOperation);
	if (FAILED(hr)) { throw ref new Platform::Exception(hr); }

	audioCompletionHandler->Wait();

	// We should have the audio client by now

	PrepareData(&renderFormat);

	hr = _audioClient->Initialize(AUDCLNT_SHAREMODE_SHARED, AUDCLNT_STREAMFLAGS_AUTOCONVERTPCM, BUFFER_SIZE_IN_SEC * 1000 * 10000, 0, &renderFormat, nullptr);
	if (FAILED(hr)) { throw ref new Platform::Exception(hr); }

	_audioClient->GetBufferSize(&_bufferSize);
	
	// Pre-roll the buffer with silence
	UINT32 padding;
	hr = _audioClient->GetCurrentPadding(&padding);
	if (FAILED(hr)) { throw ref new Platform::Exception(hr); }

	_audioClient->GetService(__uuidof(IAudioRenderClient), &_audioRenderClient);
	_audioClient->GetService(__uuidof(IAudioStreamVolume), &_audioStreamVolume);

	PBYTE buffer;
	_audioRenderClient->GetBuffer(_bufferSize - padding, &buffer);

	FillBuffer(buffer, _bufferSize - padding);

	_audioRenderClient->ReleaseBuffer(_bufferSize - padding, 0);

	_renderThread = std::thread([&]()
	{
		std::unique_lock<std::mutex> lk(_terminateThreadLock);
		// Condition variable wait below is subject to spurious wakes !! Hence use of a predicate
		while (_terminateRenderThread.wait_for(lk, std::chrono::seconds(BUFFER_SIZE_IN_SEC / 2), [&]() { return _terminateThread; }) == false)
		{
			UINT32 padding;
			_audioClient->GetCurrentPadding(&padding);

			PBYTE buffer;
			_audioRenderClient->GetBuffer(_bufferSize - padding, &buffer);

			FillBuffer(buffer, _bufferSize - padding);

			_audioRenderClient->ReleaseBuffer(_bufferSize - padding, 0);
		}

		_audioClient->Stop();
	});

	_audioClient->Start();
}

void SineTone::Stop()
{
	{
		std::unique_lock<std::mutex> lk(_terminateThreadLock);
		_terminateThread = true;
		_terminateRenderThread.notify_all();
	}
	_renderThread.join();
}

void SineTone::SetMasterVolume(float volume)
{
	_masterVolume = volume;
	UpdateVolume();
}

void SineTone::SetLeftVolume(float volume)
{
	_leftVolume = volume;
	UpdateVolume();
}

void SineTone::SetRightVolume(float volume)
{
	_rightVolume = volume;
	UpdateVolume();
}

void SineTone::UpdateVolume()
{
	_audioStreamVolume->SetChannelVolume(0, _masterVolume *_leftVolume);
	_audioStreamVolume->SetChannelVolume(1, _masterVolume *_rightVolume);
}