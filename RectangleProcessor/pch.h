#pragma once

#include <collection.h>
#include <ppltasks.h>

#include <initguid.h>
#include <Audioclient.h>
#include <mmdeviceapi.h>

template<typename T, typename P>
struct OutParameterWrapper
{
	OutParameterWrapper(P& Target) : m_Target(Target), m_pSource(nullptr)
	{}

	~OutParameterWrapper()
	{
		m_Target.reset(m_pSource);
	}
	operator T**()
	{
		return &m_pSource;
	}

	P& m_Target;
	T* m_pSource;
};

template<typename P>
OutParameterWrapper<typename P::element_type, P> MakeOutParameterWrapper(P& Target)
{
	return OutParameterWrapper<typename P::element_type, P>(Target);
}

using unique_cotaskmem_wfx = std::unique_ptr<WAVEFORMATEX, decltype(::CoTaskMemFree)>;
