import svgPaths from "./svg-609qo653ae";

function Title() {
  return (
    <div className="content-stretch flex items-center justify-center px-[10px] relative rounded-[5px] shrink-0" data-name="Title">
      <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular',sans-serif] h-[40px] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center w-[56px]">
        <p className="leading-[0px]">MODE</p>
      </div>
    </div>
  );
}

function Title1() {
  return (
    <div className="content-stretch flex items-center justify-center px-[10px] relative rounded-[5px] shrink-0" data-name="Title">
      <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular',sans-serif] h-[40px] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center w-[90px]">
        <p className="leading-[0px]">MONTHLY</p>
      </div>
    </div>
  );
}

function Mode() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Mode">
      <Title />
      <Title1 />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Refresh cw">
        <div className="absolute inset-[12.51%_4.17%]" data-name="Icon">
          <div className="absolute inset-[-2.78%_-2.27%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 18.9953">
              <path d={svgPaths.p224da980} id="Icon" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]" data-name="Button">
      <div className="overflow-clip relative shrink-0 size-[36px]" data-name="Home">
        <div className="absolute inset-[8.33%_12.5%]" data-name="Icon">
          <div className="absolute inset-[-1.67%_-1.85%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 31">
              <path d={svgPaths.pa43ef0} id="Icon" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]" data-name="Button">
      <div className="overflow-clip relative shrink-0 size-[36px]" data-name="Edit 2">
        <div className="absolute inset-[9.05%_9.05%_8.33%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-1.68%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.7427 30.7427">
              <path d={svgPaths.p1c421100} id="Icon" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]" data-name="Button">
      <div className="overflow-clip relative shrink-0 size-[36px]" data-name="Table">
        <div className="absolute inset-[12.5%]" data-name="Icon">
          <div className="absolute inset-[-1.85%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
              <path d={svgPaths.p2c432880} id="Icon" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="Icon">
          <path d={svgPaths.pfe95200} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3480a400} id="Vector_2" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]" data-name="Button">
      <Icon />
    </div>
  );
}

function ButtonGroup() {
  return (
    <div className="content-stretch flex gap-[25px] items-center relative shrink-0" data-name="ButtonGroup">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Mode />
        <ButtonGroup />
      </div>
    </div>
  );
}

function Date() {
  return (
    <div className="flex-[1_0_0] h-[60px] min-w-px relative" data-name="Date">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[10px] relative size-full">
          <div className="flex flex-col font-['Khand:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[40px] whitespace-nowrap">
            <p className="leading-[0px]">2026 05</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Date />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start pb-[0.5px] relative shrink-0 w-full" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#1e1e1e] border-b-[0.5px] border-solid inset-0 pointer-events-none" />
      <Container2 />
      <Container3 />
    </div>
  );
}

function Button4() {
  return (
    <div className="flex-[224_0_0] min-w-px relative" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[96px] py-[11px] relative size-full">
          <p className="font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] leading-[24px] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            収入
          </p>
        </div>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="flex-[224_0_0] min-w-px relative" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[88px] py-[10px] relative size-full">
          <p className="font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] leading-[24px] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            固定費
          </p>
        </div>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="flex-[224_0_0] min-w-px relative" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#2c2c2c] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[88px] py-[11px] relative size-full">
          <p className="font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] leading-[24px] relative shrink-0 text-[#0a0a0a] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            変動費
          </p>
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[51px] items-center justify-center pb-px relative shrink-0 w-[1050px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Button4 />
      <Button5 />
      <Button6 />
    </div>
  );
}

function Date1() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">支払日</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">カテゴリー</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuotationAmount() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="QuotationAmount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">見積</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementsAmount() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="AchievementsAmount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">実績</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">備考</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderRow() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="HeaderRow">
      <Date1 />
      <Category />
      <QuotationAmount />
      <AchievementsAmount />
      <Remarks />
    </div>
  );
}

function Date2() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category1() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount1() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks1() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Date3() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category2() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount2() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount3() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks2() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Date4() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category3() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount4() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount5() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks3() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Date5() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category4() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount6() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount7() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks4() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Date6() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category5() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount8() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount9() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks5() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Date7() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category6() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount10() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount11() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks6() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Date8() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category7() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount12() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount13() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks7() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Date9() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category8() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount14() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount15() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks8() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Date10() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category9() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount16() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount17() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks9() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Date11() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category10() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount18() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount19() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks10() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Date12() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category11() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount20() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount21() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks11() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Date13() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category12() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount22() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount23() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks12() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Date14() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category13() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount24() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount25() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks13() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Date15() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category14() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount26() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount27() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks14() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Date16() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Date">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">2026/05/18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category15() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Category">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[15px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] min-w-px relative text-[#717182] text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">推し課金</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount28() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amount29() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Amount">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[15px] relative size-full">
          <div className="flex flex-col font-['Saira_Condensed:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap">
            <p className="leading-[normal]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Remarks15() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Remarks">
      <div aria-hidden="true" className="absolute border-[#717182] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[15px] relative size-full">
          <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[24px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
            <p className="leading-[normal]">その他</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Table() {
  return (
    <div className="relative shrink-0 w-full" data-name="Table">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center px-[23px] py-[2px] relative size-full">
          <HeaderRow />
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date2 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category1 />
            </div>
            <Amount />
            <Amount1 />
            <Remarks1 />
          </div>
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date3 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category2 />
            </div>
            <Amount2 />
            <Amount3 />
            <Remarks2 />
          </div>
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date4 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category3 />
            </div>
            <Amount4 />
            <Amount5 />
            <Remarks3 />
          </div>
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date5 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category4 />
            </div>
            <Amount6 />
            <Amount7 />
            <Remarks4 />
          </div>
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date6 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category5 />
            </div>
            <Amount8 />
            <Amount9 />
            <Remarks5 />
          </div>
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date7 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category6 />
            </div>
            <Amount10 />
            <Amount11 />
            <Remarks6 />
          </div>
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date8 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category7 />
            </div>
            <Amount12 />
            <Amount13 />
            <Remarks7 />
          </div>
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date9 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category8 />
            </div>
            <Amount14 />
            <Amount15 />
            <Remarks8 />
          </div>
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date10 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category9 />
            </div>
            <Amount16 />
            <Amount17 />
            <Remarks9 />
          </div>
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date11 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category10 />
            </div>
            <Amount18 />
            <Amount19 />
            <Remarks10 />
          </div>
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date12 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category11 />
            </div>
            <Amount20 />
            <Amount21 />
            <Remarks11 />
          </div>
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date13 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category12 />
            </div>
            <Amount22 />
            <Amount23 />
            <Remarks12 />
          </div>
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date14 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category13 />
            </div>
            <Amount24 />
            <Amount25 />
            <Remarks13 />
          </div>
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date15 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category14 />
            </div>
            <Amount26 />
            <Amount27 />
            <Remarks14 />
          </div>
          <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-name="DataRow">
            <Date16 />
            <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
              <Category15 />
            </div>
            <Amount28 />
            <Amount29 />
            <Remarks15 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[25px] relative size-full">
          <Table />
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[50px] items-center relative shrink-0 w-full" data-name="Container">
      <Header />
      <Container4 />
      <Container5 />
    </div>
  );
}

function Container() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pt-[32px] px-[35px] relative size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[1222px]" data-name="Body">
      <Container />
    </div>
  );
}

export default function MoneManaListUi() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start pb-[50px] relative size-full" data-name="mone-mana List UI">
      <Body />
    </div>
  );
}