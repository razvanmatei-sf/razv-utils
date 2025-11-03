"""
Dynamic Prompt List Node
A ComfyUI custom node with dynamic input count for managing prompt lists.
"""

class DynamicPromptList:
    """
    Dynamic prompt list node with configurable number of inputs.
    Allows you to create a list of prompts with adjustable input count.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "inputcount": ("INT", {"default": 5, "min": 2, "max": 50, "step": 1}),
                "prompt_1": ("STRING", {"multiline": True, "default": "prompt"}),
            },
            "optional": {
                "prompt_2": ("STRING", {"multiline": True, "default": "prompt"}),
            },
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("prompt_list",)
    FUNCTION = "create_prompt_list"
    CATEGORY = "Serhii/Utils"

    DESCRIPTION = """
Creates a list of prompts with dynamic input count.
Set the number of inputs with the **inputcount** parameter
and click "Update inputs" button to add/remove prompt fields.
"""

    def create_prompt_list(self, inputcount, **kwargs):
        """
        Creates a list of prompts from dynamic inputs.

        Args:
            inputcount: Number of prompt inputs
            **kwargs: Dynamic prompt inputs (prompt_1, prompt_2, etc.)

        Returns:
            Tuple containing the list of prompts
        """
        prompts = []

        # Collect all prompts from dynamic inputs
        for i in range(1, inputcount + 1):
            prompt_key = f"prompt_{i}"
            prompt = kwargs.get(prompt_key, "")

            # Only add non-empty prompts
            if prompt and prompt.strip():
                prompts.append(prompt.strip())

        # Return as a list (can be used with other nodes)
        return (prompts,)


# Node registration
NODE_CLASS_MAPPINGS = {
    "Dynamic Prompt List": DynamicPromptList,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "Dynamic Prompt List": "📝 Dynamic Prompt List",
}
