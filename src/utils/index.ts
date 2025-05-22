export const isDataEmpty = (...args: any) => {
  console.log(args);
  
}

/**
 * 將數字或數字字串格式化為帶有千分位逗號的字串。
 * 例如：1300 -> "1,300"
 * 12345.67 -> "12,345.67"
 * "50000" -> "50,000"
 *
 * @param {string | number} value 要格式化的值
 * @returns {string} 格式化後的字串，如果輸入無法轉換為有效數字，則回傳原始輸入的字串形式。
 */
export const formatNumberWithCommas = (value: string | number): string => {
  // 處理 null、undefined 或空字串的情況
  if (value === null || value === undefined) {
    return ''; // 或者可以回傳 '0' 或其他預設值
  }

  const stringValue = String(value).trim();
  if (stringValue === '') {
    return ''; // 或者可以回傳 '0'
  }

  // 移除字串中可能已存在的逗號，以便正確轉換為數字
  const cleanedStringValue = stringValue.replace(/,/g, '');

  // 嘗試將清理後的字串轉換為數字
  const numberValue = parseFloat(cleanedStringValue);

  // 檢查是否為有效數字
  if (isNaN(numberValue)) {
    // 如果無法轉換為有效數字，直接回傳原始輸入的字串形式
    // 你也可以選擇在這裡拋出錯誤或回傳特定的錯誤提示字串
    return String(value);
  }

  // 使用 toLocaleString() 方法來進行千分位格式化
  // 'en-US' 這個區域設定會使用逗號作為千分位分隔符，句號作為小數點
  return numberValue.toLocaleString('en-US');
}
