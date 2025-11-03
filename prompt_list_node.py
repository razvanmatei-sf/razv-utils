"""
Dynamic Prompt List Node
A ComfyUI custom node with dynamic widget count for managing prompt lists.
"""

class DynamicPromptList:
    """
    Dynamic prompt list node with configurable number of text box widgets.
    Returns a comma-separated string of all prompts.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "inputcount": ("INT", {"default": 5, "min": 2, "max": 50, "step": 1}),
            },
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("prompt_list",)
    FUNCTION = "create_prompt_list"
    CATEGORY = "Serhii/Utils"

    DESCRIPTION = """
Creates a comma-separated list of prompts with dynamic text box count.
Set the number of text boxes with the **inputcount** parameter
and click "Update inputs" button to add/remove prompt text boxes.
"""

    def create_prompt_list(self, inputcount, **kwargs):
        """
        Creates a comma-separated string from dynamic text box widgets.

        Args:
            inputcount: Number of prompt text boxes
            **kwargs: Dynamic prompt values (prompt_1, prompt_2, etc.)

        Returns:
            Tuple containing comma-separated string of prompts
        """
        prompts = []

        # Collect all prompts from dynamic widgets
        for i in range(1, inputcount + 1):
            prompt_key = f"prompt_{i}"
            prompt = kwargs.get(prompt_key, "")

            # Add all prompts (including empty ones will just be empty in list)
            if prompt and prompt.strip():
                prompts.append(prompt.strip())

        # Return as comma-separated string
        return (",".join(prompts),)


# Node registration
NODE_CLASS_MAPPINGS = {
    "Dynamic Prompt List": DynamicPromptList,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "Dynamic Prompt List": "📝 Dynamic Prompt List",
}
