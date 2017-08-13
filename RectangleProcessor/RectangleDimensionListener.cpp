#include "pch.h"
#include "RectangleDimensionListener.h"

using namespace RectangleProcessor;
using namespace Platform;

RectangleDimensionListener::RectangleDimensionListener()
{
	_pTone.Start();
}

void RectangleDimensionListener::UpdateArea(float area)
{
	const float maxArea = 1500.F * 768.F;
	float volume = area / maxArea;
	volume = min(volume, 1.0F);
	_pTone.SetMasterVolume(volume);
}

void RectangleDimensionListener::UpdatePosition(int left, int right)
{
	int centerOfGravity = left + right / 2;
	float distToCenter = (centerOfGravity - 750.0F) / 750.F; // Value between -1 and +1
	float rightVolume = (distToCenter - (-1.F)) / 2.F;
	float leftVolume = 1.0 - rightVolume;
	_pTone.SetLeftVolume(leftVolume);
	_pTone.SetRightVolume(rightVolume);
}