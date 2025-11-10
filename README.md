# Treeversal Note 算式樹演算法展示
一則樹訪之算式解題的演算法展示。

聽說是微軟的面試問題。

有輸入如下：

```
+
/ \
* %
/ \ / \
1 2 3 4
```

求製作一則程式，以求該算式 `(1 * 2) + (3 % 4)` 的解。

## 程式執行
取得這套程式：程式依賴 [Bun](https://bun.com/) 與 [React](https://bun.com/docs/guides/ecosystem/react) ，

```git
git clone  git@github.com:YauHsien/treeversal-note.git   treeversal_note_1
cd  treeversal_note_1/
bun install
bun dev
```

程式啟動於伺服器網址 `http://localhost:3000/` ，以瀏覽器開啟此網址，即可瀏覽算式樹演算法展示。

## 使用方式

1. 開啟展示畫面。
   ![以瀏覽器開啟 http://localhost:300/ 以瀏覽畫面。](./rc/1.png "展示畫面")
2. 輸入算式樹。
   ![在方框裡輸入合格的算式樹，點擊輸入按鈕並通過輸入格式檢核，即可點擊展示演算法按鈕。](./rc/2.png "輸入合格的算式樹")
   ![若輸入了不合格的算式樹，點擊輸入按鈕之後，檢核方框提示輸入不合格。](./rc/3.png "輸入不合格的算式樹")
3. 展示演算法。
   ![展示演算法之畫面以醒目的操作指引，協助您瀏覽當前問題的求解過程。](./rc/4.png "引導展示")

## 算式樹例子

1. [input](./input)
2. [input2](./input2)
