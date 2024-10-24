"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import * as signalR from "@microsoft/signalr";

export default function useSignalRReaderSubscriber({
  username,
}: {
  username: string;
}) {
  const [events, setEvents] = useState<any[]>([]);
  const [event, setEvent] = useState<any[]>([]);

  useEffect(() => {
    const subscribeToMessages = () => {
      const token = "pat-a261a0bf97f247a689ef472beb3cf6f9";
      const environmentId = "sherif-flashpath-dev";
      const topic = "raw-websocket";
      const streamId = username;

      const options = {
        accessTokenFactory: () => token,
      };

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(
          `https://reader-${environmentId}.platform.quix.io/hub`,
          options
        )
        .build();

      let tempEvents: any[] = []; // Temporary array to collect events
      let timer: NodeJS.Timeout | null; // Timer reference for the 10-second window

      connection.start().then(() => {
        console.log("Connected to Quix.");

        // Subscribe to parameter data stream
        connection.invoke("SubscribeToParameter", topic, streamId, "*");

        // Read data from the stream
        connection.on("ParameterDataReceived", (data) => {
          const event = JSON.parse(data.stringValues.rrweb_event);
          setEvent(event);
          console.log("Received event from Quix:", event);
          tempEvents.push(event); // Collect events

          if (!timer) {
            // Start a 10-second timer if it's not already running
            timer = setTimeout(() => {
              setEvents([...tempEvents]); // Set events to state after 10 seconds
              tempEvents = []; // Clear the temporary array
              timer = null; // Reset timer reference
              // connection.off("ParameterDataReceived"); // Unsubscribe from the stream
            }, 20000);
          }
        });
      });

      // check if the connection is on connected state then unsubscribe
      if (connection.state === signalR.HubConnectionState.Connected) {
        return connection.invoke(
          "UnsubscribeFromParameter",
          topic,
          streamId,
          "*"
        );
      }
    };

    subscribeToMessages();
  }, [username]);

  return { events, event };
}
