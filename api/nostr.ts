const { Relay, useWebSocketImplementation } = require("nostr-tools/relay");
const { finalizeEvent } = require("nostr-tools");
import WebSocket from "ws";

useWebSocketImplementation(WebSocket);
const relayUrl = "wss://relay.betrea.xyz";
const maxRetries = 5;
let retryCount = 0;

export async function connectToRelay() {
  console.log("Connecting to Nostr relay...");
  try {
    const relay = await Relay.connect(relayUrl);
    console.log("Connected to Nostr relay:", relay.url);
    retryCount = 0;
    return relay;
  } catch (error) {
    console.error("Error in Nostr connection:", (error as any).message);

    if (retryCount < maxRetries) {
      retryCount++;
      console.log(`Retrying connection... (${retryCount}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return connectToRelay();
    } else {
      console.error("Max retries reached. Unable to connect to Nostr relay.");
      return null;
    }
  }
}

// Send message function remains the same
export async function sendMessage(privateKey: Uint8Array, message: string) {
  const relay = await connectToRelay();

  if (!relay) {
    console.error("Failed to connect to relay, message not sent.");
    return;
  }

  const eventTemplate = {
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: `betrea:${message}`,
  };

  const signedEvent = finalizeEvent(eventTemplate, privateKey);
  try {
    await relay.publish(signedEvent);
    console.log("Message sent:", signedEvent);
    relay.close();
  } catch (error) {
    console.error("Error sending message:", error);
  } finally {
    relay.close();
  }
}

// Subscribe function with callback for new messages
export async function subscribeToMessages(
  onMessageReceived: (event: any) => void
) {
  const relay = await connectToRelay();

  if (!relay) {
    console.error("Failed to connect to relay for subscribing.");
    return;
  }

  const sub = relay.subscribe([{ kinds: [1] }], {
    onevent(event: any) {
      if (event.content.startsWith("betrea:")) {
        console.log("Filtered event received:", event);
        onMessageReceived(event); // Pass message to the callback
      }
    },
    oneose() {
      console.log("End of subscription");
      sub.close();
    },
  });
}

async function test() {
  subscribeToMessages((event) => {
    console.log("Received message:", event);
  });
}
