"use client";
import React, { useContext } from "react";

import "@/styles/client/notification.css";
import { NotificationContext } from "@/Contexts/NotificationContext";
import Notification from "@/components/Tools/Notification";

function NotificationHolder() {
  const { notificationMessages, curentNotficationClosedCount } =
    useContext(NotificationContext);

  return (
    <div
      className="notification-holder"
      style={{
        transform:
          curentNotficationClosedCount > 0 && notificationMessages.length !== 1
            ? `translateY(-${curentNotficationClosedCount * 100}px)`
            : `translateY(0px)`,
      }}
    >
      {notificationMessages.map((x, index) => (
        <Notification key={index} data={x} />
      ))}
    </div>
  );
}

export default NotificationHolder;
