from .qwen_resolution_node import NODE_CLASS_MAPPINGS as QWEN_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS as QWEN_DISPLAY
from .prompt_list_node import NODE_CLASS_MAPPINGS as PROMPT_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS as PROMPT_DISPLAY

# Merge all node mappings
NODE_CLASS_MAPPINGS = {**QWEN_MAPPINGS, **PROMPT_MAPPINGS}
NODE_DISPLAY_NAME_MAPPINGS = {**QWEN_DISPLAY, **PROMPT_DISPLAY}

__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS']

# Expose WEB_DIRECTORY for JavaScript loading
import os
WEB_DIRECTORY = os.path.join(os.path.dirname(os.path.realpath(__file__)), "web")
