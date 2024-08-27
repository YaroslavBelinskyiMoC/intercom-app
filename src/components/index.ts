import articles from '../dataFiles/mock_article'

const initialCanvas = {
  canvas: {
    content: {
      components: [
        {
          type: "text",
          id: "department",
          text: "This contact works in:",
          align: "center",
          style: "header",
        },
        {
          type: "checkbox",
          id: "departmentChoice",
          label: "",
          options: [
            {
              type: "option",
              id: "sales",
              text: "Sales",
            },
            {
              type: "option",
              id: "operations",
              text: "Operations",
            },
            {
              type: "option",
              id: "engineering",
              text: "Engineering",
            },
          ],
        },
        {
          type: "button",
          label: "Submit",
          style: "primary",
          id: "submit_button",
          action: {
            type: "submit",
          },
        },
      ],
    },
  },
};

function createFinalCanvas(department: Text) {
  const finalCanvas = {
    canvas: {
      content: {
        components: [
          {
            type: "text",
            id: "thanks",
            text: "You chose: " + department,
            align: "center",
            style: "header",
          },
          {
            type: "button",
            label: "Submit another",
            style: "primary",
            id: "refresh_button",
            action: {
              type: "submit",
            },
          },
        ],
      },
    },
  };

  return finalCanvas;
}

const textCanvas = {
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
          "text": "How can I help you today?",
          "style": "muted"
        },
        {
          "type": "spacer",
          "size": "m"
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
          "size": "l"
        },
        {
          "type": "divider"
        },
        {
          "type": "spacer",
          "size": "l"
        },
        {
          "type": "text",
          "text": "⭐️ *You*",
          "style": "header"
        },
        {
          "type": "text",
          "text": "*How to create landing page in Zipify Pages?*",
          "style": "paragraph"
        },
        {
          "type": "spacer",
          "size": "l"
        },
        {
          "type": "divider"
        },
        {
          "type": "spacer",
          "size": "l"
        },
        {
          "type": "text",
          "text": "*🔮 Zipify Agent Assist:*",
          "align": "left",
          "style": "header"
        },
        {
          "type": "text",
          "text": "Building landing pages may seem a little intimidating at first, but it’s really easy to get started with Zipify Pages! Below are some simple steps to have your first page built and published in minutes!",
          "style": "paragraph"
        },
        {
          "type": "text",
          "text": "First, open the app and click *'Pages'* in the left-hand menu, *Landing Pages* will be selected by default. Click on the ['New Page'](https://developers.intercom.io/) button in the upper right corner.",
          "style": "paragraph"
        },
        {
          "type": "image",
          "align": "left",
          "width": 400,
          "height": 350,
          "url": "https://zipify-b4af458812bb.intercom-attachments-7.com/i/o/764679756/db128d80963cbd605cf6e20d/3t4UBvJWy8U1PgXnsO0vxI0ZqC2SlGLhWQ2rtPzmlq9mFbD72J7GA3TicK_thwcpEmnVa993lLKDs_kuRohRcRQ1HzjRMWJls_OcBHe_W-Vet8Q3zCTsEp9deOG8cgkv4-OoA9wkCPAcsg-WH-TlDhw?expires=1724325300&signature=c635434cb3d7c57284967c0b46e3df4afb0be7c49d7da07d1d517ed0ab2a9de9"
        },
        {
          "type": "text",
          "text": "Once you’re inside the page builder, you can click on various elements of the sections that make up the template and edit them as you see fit. You can change the text, colors, images, and more!",
          "style": "paragraph"
        },
        {
          "type": "image",
          "align": "left",
          "width": 400,
          "height": 250,
          "url": "https://downloads.intercomcdn.com/i/o/902804469/304cef17f1c243ddda310a7b/image.png?expires=1724325300&signature=c00c816c1ee3c4a8aee0c31aec8cd96471a59d313d6889c124d293349f10507f"
        },
        {
          "type": "spacer",
          "size": "l"
        },
        {
          "type": "divider"
        },
        {
          "type": "spacer",
          "size": "l"
        },
        {
          "type": "text",
          "text": "⭐️ *You*",
          "style": "header"
        },
        {
          "type": "text",
          "text": "*How to remove Zipify Pages app?*",
          "style": "paragraph"
        },
        {
          "type": "spacer",
          "size": "l"
        },
        {
          "type": "divider"
        },
        {
          "type": "spacer",
          "size": "l"
        },
        {
          "type": "text",
          "text": "*🔮 Zipify Agent Assist:*",
          "align": "left",
          "style": "header"
        },
        {
          "type": "text",
          "text": "At *Settings > General > Advanced Settings > Application Assets* Management, you are able to manage the app's assets:",
          "style": "paragraph"
        },
        {
          "type": "image",
          "align": "left",
          "width": 400,
          "height": 250,
          "url": "https://downloads.intercomcdn.com/i/o/231972708/9c1f934196081ddf55c6c757/image.png?expires=1724333400&signature=2ad82b5ffb67e286c3d51ac608e02d8afc38158aebc978d9c5c6f24f146371b9"
        },
        {
          "type": "spacer",
          "size": "l"
        },
        {
          "type": "divider"
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
          "text": "*Refresh Assets:*",
          "style": "paragraph"
        },
        {
          "type": "text",
          "text": "Click the Refresh button to restore the app's Assets to their initial/default state in-case you encounter any issues with the application.",
          "style": "paragraph"
        },
        {
          "type": "text",
          "text": "This will re-create all Zipify Pages app assets (files and code) which means that any customizations made to assets in any other way than we recommend would be lost.",
          "style": "paragraph"
        },
        {
          "type": "spacer",
          "size": "l"
        },
        {
          "type": "divider"
        },
        {
          "type": "textarea",
          "id": "description",
          "label": "",
          "placeholder": "🙂 I’m here to help. Just ask..."
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

const requestCanvas = {
  canvas: {
    content: {
      components: [
        {
          type: "textarea",
          id: "your_request",
          label: "Your request",
          placeholder: "Input here...",
        },
        {
          type: "button",
          label: "Submit",
          style: "primary",
          id: "submit_button",
          action: {
            type: "submit",
          },
        },
      ],
    },
  },
};

function additionalAnswerGenerator(userQuestion: string) {
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
      "style": "paragraph"
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
    },
    {
      "type": "text",
      "text": "*🔮 Zipify Agent Assist:*",
      "align": "left",
      "style": "header"
    },
    {
      "type": "text",
      "text": "Zipify Pages offers a variety pricing plans, depending on your needs:",
      "style": "paragraph"
    },
    {
      "type": "image",
      "align": "left",
      "width": 400,
      "height": 175,
      "url": "https://downloads.intercomcdn.com/i/o/903992511/0b111138fa1bf92191e107d6/image.png?expires=1724342400&signature=cf45608e6f26fc16214ba1bc055834991561a86f822e7aa93c05ce5743f668fb"
    },
    {
      "type": "text",
      "text": "[Click here](https://apps.shopify.com/zipifypages) for more details about our subscription plans!",
      "style": "paragraph"
    },
  ]
  return components;
}
export { initialCanvas, textCanvas, requestCanvas, createFinalCanvas, additionalAnswerGenerator }