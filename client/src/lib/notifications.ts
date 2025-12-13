/**
 * ブラウザ通知機能のヘルパー
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("このブラウザは通知をサポートしていません");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

export function showNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      ...options,
    });

    // 通知をクリックしたらウィンドウにフォーカス
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }
  return null;
}

export function showPraiseNotification(from: string, message: string, stampType: string) {
  const emoji = stampType === "help" ? "❤️" : 
                stampType === "idea" ? "💡" :
                stampType === "kind" ? "✨" : "🏆";
  
  showNotification(`${emoji} ${from}さんからほめトークン！`, {
    body: message || "あなたをほめました",
    tag: "praise",
    requireInteraction: false,
  });
}

export function showCooperationNotification(title: string, currentApprovals: number, requiredApprovals: number) {
  showNotification(`🤝 協力NFT: ${title}`, {
    body: `承認状況: ${currentApprovals}/${requiredApprovals}`,
    tag: "cooperation",
    requireInteraction: false,
  });
}

export function showCooperationCompleteNotification(title: string) {
  showNotification(`🎉 協力NFT完成！`, {
    body: `「${title}」が全員の承認を得ました！`,
    tag: "cooperation-complete",
    requireInteraction: true,
  });
}
