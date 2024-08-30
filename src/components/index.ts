const initialCanvas = {
  canvas: {
    content: {
      components: [
        {
          "type": "image",
          "width": 30,
          "height": 30,
          "url": "https://zipify.com/wp-content/themes/SmartMarketer/img/favicon.png"
        },
        {
          "type": "text",
          "text": "*Hi 👋, I'm Zipify Agent Assist*",
          "style": "paragraph",
          "bottom_margin": "none"
        },
        {
          "type": "text",
          "text": "⚡️ I can find answers to customer queries by searching your team’s help articles and past conversations.",
          "style": "header"
        },
        {
          "type": "text",
          "text": "🔒 Our conversation is only visible to you.",
          "style": "header"
        },
        {
          "type": "spacer",
          "size": "m"
        },
        {
          "type": "textarea",
          "id": "your_request",
          "label": "How can I help your?",
          "placeholder": "Input here your question here...",
        },
        {
          "type": "button",
          "label": "Submit",
          "style": "primary",
          "id": "submit-issue-form",
          "action": {
            "type": "submit",
          },
        },
      ],
    },
  },
};

const endingCanvas = {
  canvas: {
    content: {
      components: [
        {
          "type": "spacer",
          "size": "m"
        },
        {
          "type": "divider"
        },
        {
          "type": "spacer",
          "size": "m"
        },
        {
          "type": "textarea",
          "id": "description",
          "label": "🙂 I’m here to help. Just ask!",
          "placeholder": "Input here your question here..."
        },
        {
          "type": "button",
          "id": "submit-issue-form",
          "label": "Ask a follow up question",
          "style": "primary",
          "action": {
            "type": "submit"
          }
        },
        {
          "type": "text",
          "text": "You can restart this dialogue and clear the history",
          "style": "paragraph",
          "bottom_margin": "none"
        },
        {
          "type": "button",
          "id": "restart_button",
          "label": "Restart",
          "style": "primary",
          "action": {
            "type": "submit"
          }
        },
      ],
    },
  },
};

function userQuestionGenerator(userQuestion: string) {
  const components = [
    {
      "type": "spacer",
      "size": "m"
    },
    {
      "type": "divider"
    },
    {
      "type": "spacer",
      "size": "m"
    },
    {
      "type": "text",
      "text": "⭐️ *You*",
      "style": "header"
    },
    {
      "type": "text",
      "text": `*${userQuestion}*`,
      "style": "header"
    },
    {
      "type": "spacer",
      "size": "m"
    },
    {
      "type": "divider"
    },
    {
      "type": "spacer",
      "size": "m"
    }
  ]
  return components;
}
export { initialCanvas, endingCanvas, userQuestionGenerator }