#pragma once
#include "SineTone.h"

namespace RectangleProcessor
{
    public ref class RectangleDimensionListener sealed
    {
    public:
		RectangleDimensionListener();
		void Stop() { _pTone.Stop();  }
		void UpdateArea(float area);
		void UpdatePosition(int left, int right);
	private:
		SineTone _pTone;
    };
}
