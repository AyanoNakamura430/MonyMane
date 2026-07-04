import svgPaths from "./svg-1o89nncx0j";

function Title() {
  return (
    <div className="content-stretch flex items-center justify-center px-[10px] relative rounded-[5px] shrink-0" data-name="Title">
      <div aria-hidden="true" className="absolute border-[#1e1e1e] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[5px]" />
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
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]" data-name="Button">
      <div className="overflow-clip relative shrink-0 size-[36px]" data-name="Edit 2">
        <div className="absolute inset-[9.05%_9.05%_8.33%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-1.68%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.7427 30.7427">
              <path d={svgPaths.p1c421100} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" />
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

function Button1() {
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
    <div className="content-stretch flex h-[60px] items-center relative shrink-0 w-[1112px]" data-name="Date">
      <div className="flex flex-col font-['Khand:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#717182] text-[40px] whitespace-nowrap">
        <p className="leading-[0px]">2026 05</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0" data-name="Container">
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

function Heading2() {
  return (
    <div className="relative shrink-0 w-[140px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative size-full">
        <p className="font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] leading-[30px] relative shrink-0 text-[#0a0a0a] text-[20px] whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
          今月使える自由費　のこり
        </p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex h-[30px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading2 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Saira_SemiCondensed:Regular',sans-serif] leading-[60px] not-italic relative shrink-0 text-[#0a0a0a] text-[60px] whitespace-nowrap">¥100,000</p>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0 w-[140px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative size-full">
        <p className="font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] leading-[30px] relative shrink-0 text-[20px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
          目標貯金額でみた場合の使える自由費　のこり
        </p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex h-[30px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading3 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Saira_SemiCondensed:Regular',sans-serif] leading-[60px] not-italic relative shrink-0 text-[60px] text-white whitespace-nowrap">¥50,000</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[75px] h-[206px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center self-stretch">
        <div className="bg-white h-full relative rounded-[5px] shrink-0 w-[500px]" data-name="Container">
          <div className="content-stretch flex flex-col gap-[16px] items-start px-[33px] py-[50px] relative size-full">
            <Container5 />
            <Paragraph />
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center self-stretch">
        <div className="bg-[#2c2c2c] h-full relative rounded-[5px] shrink-0 w-[500px]" data-name="Container">
          <div className="content-stretch flex flex-col gap-[16px] items-start px-[33px] py-[50px] relative size-full">
            <Container6 />
            <Paragraph1 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="relative shrink-0" data-name="Heading">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[18px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
          <p className="leading-[27px]">収入</p>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[380px] h-[36px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Saira_SemiCondensed:Medium',sans-serif] leading-[40px] not-italic relative shrink-0 text-[#0a0a0a] text-[36px] whitespace-nowrap">¥300,000</p>
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative shrink-0" data-name="Heading">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[18px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
          <p className="leading-[27px]">固定費合計</p>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[380px] h-[36px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading1 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Saira_SemiCondensed:Medium',sans-serif] leading-[40px] not-italic relative shrink-0 text-[#0a0a0a] text-[36px] whitespace-nowrap">¥120,000</p>
    </div>
  );
}

function Heading4() {
  return (
    <div className="relative shrink-0" data-name="Heading">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[18px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
          <p className="leading-[27px]">変動費合計</p>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex gap-[380px] h-[36px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading4 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Saira_SemiCondensed:Medium',sans-serif] leading-[40px] not-italic relative shrink-0 text-[#0a0a0a] text-[36px] whitespace-nowrap">¥80,000</p>
    </div>
  );
}

function Heading5() {
  return (
    <div className="relative shrink-0" data-name="Heading">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <div className="flex flex-col font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] justify-center leading-[0] relative shrink-0 text-[#717182] text-[18px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
          <p className="leading-[27px]">目標貯金額</p>
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex h-[36px] items-center justify-between relative shrink-0 w-[450px]" data-name="Container">
      <Heading5 />
      <div className="relative shrink-0 size-[30px]" data-name="EditButton">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[7.83%_7.83%_8.33%_8.33%]" data-name="Icon">
            <div className="absolute inset-[-1.99%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.1517 26.1517">
                <path d={svgPaths.p227ed000} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Saira_SemiCondensed:Medium',sans-serif] leading-[40px] not-italic relative shrink-0 text-[#0a0a0a] text-[36px] whitespace-nowrap">¥50,000</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-center flex flex-wrap gap-[50px_75px] items-center justify-center px-[5px] py-[75px] relative size-full">
          <div className="bg-white content-stretch flex flex-col gap-[16px] h-[142px] items-start p-[25px] relative rounded-[5px] shrink-0 w-[500px]" data-name="Container-Sub">
            <div aria-hidden="true" className="absolute border-[#2c2c2c] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none rounded-[5px]" />
            <Container8 />
            <Paragraph2 />
          </div>
          <div className="bg-white content-stretch flex flex-col gap-[16px] h-[142px] items-start p-[25px] relative rounded-[5px] shrink-0 w-[500px]" data-name="Container-Sub">
            <div aria-hidden="true" className="absolute border-[#2c2c2c] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none rounded-[5px]" />
            <Container9 />
            <Paragraph3 />
          </div>
          <div className="bg-white content-stretch flex flex-col gap-[16px] h-[142px] items-start p-[25px] relative rounded-[5px] shrink-0 w-[500px]" data-name="Container-Sub">
            <div aria-hidden="true" className="absolute border-[#2c2c2c] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none rounded-[5px]" />
            <Container10 />
            <Paragraph4 />
          </div>
          <div className="bg-white content-stretch flex flex-col gap-[16px] h-[142px] items-start p-[25px] relative rounded-[5px] shrink-0 w-[500px]" data-name="Container-Sub">
            <div aria-hidden="true" className="absolute border-[#2c2c2c] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none rounded-[5px]" />
            <Container11 />
            <Paragraph5 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] leading-[30px] left-0 text-[#0a0a0a] text-[20px] top-[-2px] whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
        収支の内訳
      </p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute bottom-1/2 contents left-[30.19%] right-[14.84%] top-[14.84%]" data-name="Group">
      <div className="absolute bottom-1/2 left-[30.19%] right-[14.84%] top-[14.84%]" data-name="Vector">
        <div className="absolute inset-[-0.56%_-0.36%_-0.56%_-0.49%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 141.897 91">
            <path d={svgPaths.p3e876580} fill="var(--fill-0, #A8A8A8)" id="Vector" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[21.66%_63.87%_32.88%_14.84%]" data-name="Group">
      <div className="absolute inset-[21.66%_63.87%_32.88%_14.84%]" data-name="Vector">
        <div className="absolute inset-[-0.6%_-1.28%_-0.58%_-0.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 55.6882 117.758">
            <path d={svgPaths.p2d45b200} fill="var(--fill-0, #D4D4D4)" id="Vector" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[62.12%_25.26%_14.84%_19.91%]" data-name="Group">
      <div className="absolute inset-[62.12%_25.26%_14.84%_19.91%]" data-name="Vector">
        <div className="absolute inset-[-1.16%_-0.5%_-0.85%_-0.49%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 141.748 60.1523">
            <path d={svgPaths.p16bc1000} fill="var(--fill-0, #6B6B6B)" id="Vector" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[14.84%]" data-name="Group">
      <Group2 />
      <Group3 />
      <Group4 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[14.84%]" data-name="Group">
      <Group1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[256px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group />
    </div>
  );
}

function PieChart() {
  return (
    <div className="relative shrink-0 size-[256px]" data-name="PieChart">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Container18() {
  return <div className="bg-[#a8a8a8] relative rounded-[5px] shrink-0 size-[16px]" data-name="Container" />;
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-2px] whitespace-nowrap">固定費</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[24px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container18 />
        <Text />
      </div>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[64px] not-italic text-[#0a0a0a] text-[16px] text-right top-[-2px] whitespace-nowrap">¥120,000</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#717182] text-[14px] text-right">40.0%</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[44px] relative shrink-0 w-[63.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph6 />
        <Paragraph7 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container17 />
      <Container19 />
    </div>
  );
}

function Container22() {
  return <div className="bg-[#d4d4d4] relative rounded-[5px] shrink-0 size-[16px]" data-name="Container" />;
}

function Text1() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-2px] whitespace-nowrap">変動費</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[24px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container22 />
        <Text1 />
      </div>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[58px] not-italic text-[#0a0a0a] text-[16px] text-right top-[-2px] whitespace-nowrap">¥80,000</p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#717182] text-[14px] text-right">26.7%</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[44px] relative shrink-0 w-[57.172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph8 />
        <Paragraph9 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container21 />
      <Container23 />
    </div>
  );
}

function Container26() {
  return <div className="bg-[#6b6b6b] relative rounded-[5px] shrink-0 size-[16px]" data-name="Container" />;
}

function Text2() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-2px] whitespace-nowrap">貯金可能額</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[24px] relative shrink-0 w-[108px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container26 />
        <Text2 />
      </div>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[64px] not-italic text-[#0a0a0a] text-[16px] text-right top-[-2px] whitespace-nowrap">¥100,000</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#717182] text-[14px] text-right">33.3%</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[44px] relative shrink-0 w-[63.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph10 />
        <Paragraph11 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container25 />
      <Container27 />
    </div>
  );
}

function Container15() {
  return (
    <div className="flex-[798_0_0] h-[164px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <Container16 />
        <Container20 />
        <Container24 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[32px] h-[256px] items-center relative shrink-0 w-full" data-name="Container">
      <PieChart />
      <Container15 />
    </div>
  );
}

function Container13() {
  return (
    <div className="relative rounded-[5px] shrink-0 w-full" data-name="Container 2">
      <div aria-hidden="true" className="absolute border-[#2c2c2c] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[35px] relative size-full">
        <Heading6 />
        <Container14 />
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] leading-[30px] left-0 text-[#0a0a0a] text-[20px] top-[-2px] whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
        固定費
      </p>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute bottom-1/2 contents left-[30.19%] right-[14.84%] top-[14.84%]" data-name="Group">
      <div className="absolute bottom-1/2 left-[30.19%] right-[14.84%] top-[14.84%]" data-name="Vector">
        <div className="absolute inset-[-0.56%_-0.36%_-0.56%_-0.49%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 141.897 91">
            <path d={svgPaths.p3e876580} fill="var(--fill-0, #A8A8A8)" id="Vector" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[21.66%_63.87%_32.88%_14.84%]" data-name="Group">
      <div className="absolute inset-[21.66%_63.87%_32.88%_14.84%]" data-name="Vector">
        <div className="absolute inset-[-0.6%_-1.28%_-0.58%_-0.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 55.6882 117.758">
            <path d={svgPaths.p2d45b200} fill="var(--fill-0, #D4D4D4)" id="Vector" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[62.12%_25.26%_14.84%_19.91%]" data-name="Group">
      <div className="absolute inset-[62.12%_25.26%_14.84%_19.91%]" data-name="Vector">
        <div className="absolute inset-[-1.16%_-0.5%_-0.85%_-0.49%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 141.748 60.1523">
            <path d={svgPaths.p16bc1000} fill="var(--fill-0, #6B6B6B)" id="Vector" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[14.84%]" data-name="Group">
      <Group7 />
      <Group8 />
      <Group9 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[14.84%]" data-name="Group">
      <Group6 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[256px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group5 />
    </div>
  );
}

function PieChart1() {
  return (
    <div className="relative shrink-0 size-[256px]" data-name="PieChart">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Container33() {
  return <div className="bg-[#a8a8a8] relative rounded-[5px] shrink-0 size-[16px]" data-name="Container" />;
}

function Text3() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-2px] whitespace-nowrap">家賃</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[24px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container33 />
        <Text3 />
      </div>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[64px] not-italic text-[#0a0a0a] text-[16px] text-right top-[-2px] whitespace-nowrap">¥120,000</p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#717182] text-[14px] text-right">40.0%</p>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[44px] relative shrink-0 w-[63.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph12 />
        <Paragraph13 />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container32 />
      <Container34 />
    </div>
  );
}

function Container37() {
  return <div className="bg-[#d4d4d4] relative rounded-[5px] shrink-0 size-[16px]" data-name="Container" />;
}

function Text4() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-2px] whitespace-nowrap">電気代</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[24px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container37 />
        <Text4 />
      </div>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[58px] not-italic text-[#0a0a0a] text-[16px] text-right top-[-2px] whitespace-nowrap">¥80,000</p>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#717182] text-[14px] text-right">26.7%</p>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[44px] relative shrink-0 w-[57.172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph14 />
        <Paragraph15 />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container36 />
      <Container38 />
    </div>
  );
}

function Container41() {
  return <div className="bg-[#6b6b6b] relative rounded-[5px] shrink-0 size-[16px]" data-name="Container" />;
}

function Text5() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-2px] whitespace-nowrap">ガス代</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[24px] relative shrink-0 w-[108px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container41 />
        <Text5 />
      </div>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[64px] not-italic text-[#0a0a0a] text-[16px] text-right top-[-2px] whitespace-nowrap">¥100,000</p>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#717182] text-[14px] text-right">33.3%</p>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[44px] relative shrink-0 w-[63.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph16 />
        <Paragraph17 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container40 />
      <Container42 />
    </div>
  );
}

function Container45() {
  return <div className="bg-[#1e1e1e] relative rounded-[5px] shrink-0 size-[16px]" data-name="Container" />;
}

function Text6() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-2px] whitespace-nowrap">サブスク</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="h-[24px] relative shrink-0 w-[108px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container45 />
        <Text6 />
      </div>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[64px] not-italic text-[#0a0a0a] text-[16px] text-right top-[-2px] whitespace-nowrap">¥10,000</p>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#717182] text-[14px] text-right">33.3%</p>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[44px] relative shrink-0 w-[63.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph18 />
        <Paragraph19 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container44 />
      <Container46 />
    </div>
  );
}

function Container30() {
  return (
    <div className="flex-[798_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <Container31 />
        <Container35 />
        <Container39 />
        <Container43 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex gap-[32px] h-[256px] items-center relative shrink-0 w-full" data-name="Container">
      <PieChart1 />
      <Container30 />
    </div>
  );
}

function Container28() {
  return (
    <div className="relative rounded-[5px] shrink-0 w-full" data-name="Container 2">
      <div aria-hidden="true" className="absolute border-[#2c2c2c] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[35px] relative size-full">
        <Heading7 />
        <Container29 />
      </div>
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] leading-[30px] left-0 text-[#0a0a0a] text-[20px] top-[-2px] whitespace-nowrap" style={{ fontVariationSettings: "'wght' 300" }}>
        変動費
      </p>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute bottom-1/2 contents left-[30.19%] right-[14.84%] top-[14.84%]" data-name="Group">
      <div className="absolute bottom-1/2 left-[30.19%] right-[14.84%] top-[14.84%]" data-name="Vector">
        <div className="absolute inset-[-0.56%_-0.36%_-0.56%_-0.49%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 141.897 91">
            <path d={svgPaths.p3e876580} fill="var(--fill-0, #A8A8A8)" id="Vector" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents inset-[21.66%_63.87%_32.88%_14.84%]" data-name="Group">
      <div className="absolute inset-[21.66%_63.87%_32.88%_14.84%]" data-name="Vector">
        <div className="absolute inset-[-0.6%_-1.28%_-0.58%_-0.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 55.6882 117.758">
            <path d={svgPaths.p2d45b200} fill="var(--fill-0, #D4D4D4)" id="Vector" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents inset-[62.12%_25.26%_14.84%_19.91%]" data-name="Group">
      <div className="absolute inset-[62.12%_25.26%_14.84%_19.91%]" data-name="Vector">
        <div className="absolute inset-[-1.16%_-0.5%_-0.85%_-0.49%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 141.748 60.1523">
            <path d={svgPaths.p16bc1000} fill="var(--fill-0, #6B6B6B)" id="Vector" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents inset-[14.84%]" data-name="Group">
      <Group12 />
      <Group13 />
      <Group14 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[14.84%]" data-name="Group">
      <Group11 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[256px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group10 />
    </div>
  );
}

function PieChart2() {
  return (
    <div className="relative shrink-0 size-[256px]" data-name="PieChart">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Container52() {
  return <div className="bg-[#a8a8a8] relative rounded-[5px] shrink-0 size-[16px]" data-name="Container" />;
}

function Text7() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-2px] whitespace-nowrap">日用品全般</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[24px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container52 />
        <Text7 />
      </div>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[64px] not-italic text-[#0a0a0a] text-[16px] text-right top-[-2px] whitespace-nowrap">¥120,000</p>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#717182] text-[14px] text-right">40.0%</p>
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[44px] relative shrink-0 w-[63.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph20 />
        <Paragraph21 />
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container51 />
      <Container53 />
    </div>
  );
}

function Container56() {
  return <div className="bg-[#d4d4d4] relative rounded-[5px] shrink-0 size-[16px]" data-name="Container" />;
}

function Text8() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-2px] whitespace-nowrap">飲食、ファッション、交通費など</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="h-[24px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container56 />
        <Text8 />
      </div>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[58px] not-italic text-[#0a0a0a] text-[16px] text-right top-[-2px] whitespace-nowrap">¥80,000</p>
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#717182] text-[14px] text-right">26.7%</p>
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[44px] relative shrink-0 w-[57.172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph22 />
        <Paragraph23 />
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container55 />
      <Container57 />
    </div>
  );
}

function Container60() {
  return <div className="bg-[#6b6b6b] relative rounded-[5px] shrink-0 size-[16px]" data-name="Container" />;
}

function Text9() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-2px] whitespace-nowrap">推し課金</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="h-[24px] relative shrink-0 w-[108px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container60 />
        <Text9 />
      </div>
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[64px] not-italic text-[#0a0a0a] text-[16px] text-right top-[-2px] whitespace-nowrap">¥100,000</p>
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#717182] text-[14px] text-right">33.3%</p>
    </div>
  );
}

function Container61() {
  return (
    <div className="h-[44px] relative shrink-0 w-[63.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph24 />
        <Paragraph25 />
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container59 />
      <Container61 />
    </div>
  );
}

function Container64() {
  return <div className="bg-[#1e1e1e] relative rounded-[5px] shrink-0 size-[16px]" data-name="Container" />;
}

function Text10() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-2px] whitespace-nowrap">行事、突発イベント</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[24px] relative shrink-0 w-[108px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container64 />
        <Text10 />
      </div>
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[64px] not-italic text-[#0a0a0a] text-[16px] text-right top-[-2px] whitespace-nowrap">¥10,000</p>
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-px not-italic relative text-[#717182] text-[14px] text-right">33.3%</p>
    </div>
  );
}

function Container65() {
  return (
    <div className="h-[44px] relative shrink-0 w-[63.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph26 />
        <Paragraph27 />
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container63 />
      <Container65 />
    </div>
  );
}

function Container49() {
  return (
    <div className="flex-[798_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <Container50 />
        <Container54 />
        <Container58 />
        <Container62 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex gap-[32px] h-[256px] items-center relative shrink-0 w-full" data-name="Container">
      <PieChart2 />
      <Container49 />
    </div>
  );
}

function Container47() {
  return (
    <div className="relative rounded-[5px] shrink-0 w-full" data-name="Container 3">
      <div aria-hidden="true" className="absolute border-[#2c2c2c] border-b-[0.5px] border-r-[0.5px] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[35px] relative size-full">
        <Heading8 />
        <Container48 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start px-[35px] py-[50px] relative shrink-0 w-[1152px]" data-name="Container">
      <Container13 />
      <Container28 />
      <Container47 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[50px] items-center relative shrink-0 w-full" data-name="Container">
      <Header />
      <Container4 />
      <Container7 />
      <Container12 />
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

export default function MoneManaDashboardUi() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start pb-[50px] relative size-full" data-name="mone-mana Dashboard UI">
      <Body />
    </div>
  );
}