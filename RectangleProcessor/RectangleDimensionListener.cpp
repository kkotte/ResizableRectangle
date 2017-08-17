#include "pch.h"
#include "RectangleDimensionListener.h"

using namespace RectangleProcessor;
using namespace Platform;

RectangleDimensionListener::RectangleDimensionListener()
{
	_pTone.Start();
}

void RectangleDimensionListener::UpdateMaxArea(int width, int height)
{
	_maxDimension = {width, height};
	UpdateVolume();
}

void RectangleDimensionListener::UpdateRectanglePosition(int x, int y, int width, int height)
{
	_rect = { x, y, width, height };
	UpdateVolume();
}

void RectangleDimensionListener::UpdateVolume()
{
	const float maxArea = 1500.F * 768.F;
	float volume = ((float)_rect.width * _rect.height) / ((float)_maxDimension.maxWidth * _maxDimension.maxHeight);
	volume = min(volume, 1.0F);

	int centerOfGravity = _rect.x + _rect.width / 2.F;
	float distToCenter = (centerOfGravity - _maxDimension.maxWidth/2.F) / _maxDimension.maxWidth/2.F; // Value between -1 and +1

	float rightVolume = (distToCenter - (-1.F)) / 2.F;
	float leftVolume = 1.0 - rightVolume;

	_pTone.SetMasterVolume(volume);
	_pTone.SetLeftVolume(leftVolume);
	_pTone.SetRightVolume(rightVolume);
}

