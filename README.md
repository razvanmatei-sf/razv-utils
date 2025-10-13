# Razv Utils - ComfyUI Custom Nodes

Utility nodes for ComfyUI workflows.

## Nodes

### Qwen Resolution Node
A node for selecting Qwen model resolutions with visual preview.

**Features:**
- Multiple aspect ratio presets (1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3)
- Visual preview of the selected resolution
- Returns width, height, resolution string, and preview image

**Category:** ControlAltAI Nodes/Qwen

## Installation

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/razvanmatei-sf/razv-utils.git
cd razv-utils
pip install -r requirements.txt
```

## Requirements

- torch
- numpy
- pillow

## Usage

1. Add the "Qwen Resolution" node to your ComfyUI workflow
2. Select your desired aspect ratio from the dropdown
3. Connect the width/height outputs to your image generation nodes
4. The preview output shows a visual representation of the selected resolution

## License

MIT License
