#pragma once
#include "SineTone.h"

namespace RectangleProcessor
{
    public ref class RectangleDimensionListener sealed
    {
    public:
		RectangleDimensionListener();
		void Stop() { _pTone.Stop();  }
		void UpdateRectanglePosition(int x, int y, int width, int height);
		void UpdateMaxArea(int width, int height);
	private:
		void UpdateVolume();
		SineTone _pTone;

		struct
		{
			int maxWidth = 1;
			int maxHeight = 1;
		} _maxDimension;

		struct
		{
			int x = 0;
			int y = 0;
			int width = 1;
			int height = 1;
		} _rect;
	};
}
