/**
 * エクスポート機能（PDF/CSV）
 */

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { parse, unparse } from "papaparse";

// 日本語フォントのサポート（簡易版）
// 本番環境では適切な日本語フォントを組み込む必要があります

/**
 * 成長記録レポートをPDFで出力
 */
export function exportGrowthReportPDF(data: {
  userName: string;
  className: string;
  totalTokens: number;
  praisesReceived: Array<{
    from: string;
    message: string;
    stampType: string;
    createdAt: Date;
  }>;
  cooperations: Array<{
    title: string;
    description: string;
    createdAt: Date;
  }>;
}) {
  const doc = new jsPDF();
  
  // タイトル
  doc.setFontSize(20);
  doc.text("Hometto Growth Report", 20, 20);
  
  // ユーザー情報
  doc.setFontSize(12);
  doc.text(`Student: ${data.userName}`, 20, 35);
  doc.text(`Class: ${data.className}`, 20, 42);
  doc.text(`Total Tokens: ${data.totalTokens}`, 20, 49);
  doc.text(`Report Date: ${new Date().toLocaleDateString("ja-JP")}`, 20, 56);
  
  // ほめトークン履歴
  doc.setFontSize(14);
  doc.text("Praise Tokens Received", 20, 70);
  
  const praiseTableData = data.praisesReceived.map(p => [
    new Date(p.createdAt).toLocaleDateString("ja-JP"),
    p.from,
    p.stampType,
    p.message || "-",
  ]);
  
  autoTable(doc, {
    startY: 75,
    head: [["Date", "From", "Type", "Message"]],
    body: praiseTableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [77, 150, 255] },
  });
  
  // 協力NFT履歴
  const finalY = (doc as any).lastAutoTable.finalY || 75;
  doc.setFontSize(14);
  doc.text("Cooperation NFTs", 20, finalY + 15);
  
  const coopTableData = data.cooperations.map(c => [
    new Date(c.createdAt).toLocaleDateString("ja-JP"),
    c.title,
    c.description || "-",
  ]);
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [["Date", "Title", "Description"]],
    body: coopTableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [107, 203, 119] },
  });
  
  // PDFを保存
  doc.save(`hometto_report_${data.userName}_${new Date().toISOString().split("T")[0]}.pdf`);
}

/**
 * トークン履歴をPDFで出力
 */
export function exportTokenHistoryPDF(data: {
  userName: string;
  praises: Array<{
    from: string;
    to: string;
    message: string;
    stampType: string;
    tokenAmount: number;
    createdAt: Date;
  }>;
}) {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text("Token History", 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Student: ${data.userName}`, 20, 35);
  doc.text(`Export Date: ${new Date().toLocaleDateString("ja-JP")}`, 20, 42);
  
  const tableData = data.praises.map(p => [
    new Date(p.createdAt).toLocaleDateString("ja-JP"),
    p.from,
    p.to,
    p.stampType,
    p.tokenAmount.toString(),
    p.message || "-",
  ]);
  
  autoTable(doc, {
    startY: 50,
    head: [["Date", "From", "To", "Type", "Tokens", "Message"]],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [255, 107, 107] },
  });
  
  doc.save(`hometto_tokens_${data.userName}_${new Date().toISOString().split("T")[0]}.pdf`);
}

/**
 * ユーザーデータをCSVで出力
 */
export function exportUsersCSV(users: Array<{
  id: number;
  name: string;
  displayName?: string;
  role: string;
  tokenBalance: number;
  createdAt: Date;
}>) {
  const csvData = users.map(u => ({
    ID: u.id,
    Name: u.displayName || u.name || "",
    Role: u.role,
    "Token Balance": u.tokenBalance,
    "Created At": new Date(u.createdAt).toLocaleDateString("ja-JP"),
  }));
  
  const csv = unparse(csvData);
  downloadCSV(csv, `hometto_users_${new Date().toISOString().split("T")[0]}.csv`);
}

/**
 * トークン履歴をCSVで出力
 */
export function exportTokenHistoryCSV(praises: Array<{
  from: string;
  to: string;
  message?: string;
  stampType: string;
  tokenAmount: number;
  createdAt: Date;
}>) {
  const csvData = praises.map(p => ({
    Date: new Date(p.createdAt).toLocaleDateString("ja-JP"),
    From: p.from,
    To: p.to,
    Type: p.stampType,
    Tokens: p.tokenAmount,
    Message: p.message || "",
  }));
  
  const csv = unparse(csvData);
  downloadCSV(csv, `hometto_token_history_${new Date().toISOString().split("T")[0]}.csv`);
}

/**
 * CSVファイルをダウンロード
 */
function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
