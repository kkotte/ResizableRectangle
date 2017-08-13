#pragma once
class SineTone
{
	friend class AudioCompletionHandler;
public:
	SineTone() {};
	~SineTone() {};

	void Start();
	void Stop();

	void SetMasterVolume(float volume);
	void SetLeftVolume(float volume);
	void SetRightVolume(float volume);

private:
	void PrepareData(const WAVEFORMATEX *format);
	void FillBuffer(PBYTE buffer, int frames);
	void UpdateVolume();

	std::unique_ptr<float> _sineToneBuffer;
	int _samplesAllocated = 0;
	int _blockAlign = 0;
	float *_readPtr;

	Microsoft::WRL::ComPtr<IAudioClient> _audioClient;
	Microsoft::WRL::ComPtr<IAudioRenderClient> _audioRenderClient;
	Microsoft::WRL::ComPtr<IAudioStreamVolume> _audioStreamVolume;

	std::thread _renderThread;
	UINT32 _bufferSize = 0;

	float _masterVolume = 1.F;
	float _rightVolume = 1.F;
	float _leftVolume = 1.F;

	bool _terminateThread = false;
	std::mutex _terminateThreadLock;
	std::condition_variable _terminateRenderThread;
};

