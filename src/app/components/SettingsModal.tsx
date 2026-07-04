interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack: _onBack }: SettingsScreenProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Title */}
      <h2 className="text-2xl font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#0a0a0a] mb-8">
        設定
      </h2>

      <div className="space-y-6">
        {/* 一般設定 */}
        <section>
          <h3 className="text-lg font-medium text-[#0a0a0a] mb-4 font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif]">
            一般設定
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <label className="text-sm text-gray-700 font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif]">
                通貨表示
              </label>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif]">
                <option>日本円 (¥)</option>
                <option>米ドル ($)</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <label className="text-sm text-gray-700 font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif]">
                デフォルト表示
              </label>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif]">
                <option>月間</option>
                <option>年間</option>
              </select>
            </div>
          </div>
        </section>

        {/* カテゴリ管理 */}
        <section className="pt-4">
          <h3 className="text-lg font-medium text-[#0a0a0a] mb-2 font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif]">
            カテゴリ管理
          </h3>
          <p className="text-sm text-gray-500 mb-4 font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif]">
            固定費・変動費のカテゴリを追加・編集できます
          </p>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif]">
            カテゴリを編集
          </button>
        </section>

        {/* データ管理 */}
        <section className="pt-4">
          <h3 className="text-lg font-medium text-[#0a0a0a] mb-4 font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif]">
            データ管理
          </h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors text-left font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif]">
              データをエクスポート
            </button>
            <button className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors text-left font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif]">
              データをインポート
            </button>
            <button className="w-full px-4 py-3 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-50 transition-colors text-left font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif]">
              すべてのデータを削除
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
