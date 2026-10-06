export const appsPageStyles = {
  appPageMainContainer: "relative mt-[43px] h-screen w-screen bg-background",
  phosphorIcons: "h-7 w-7 max-md:h-[23px] max-md:w-[23px]",
  appsDisplayContainer: "h-[90%] max-md:px-5 max-md:pt-0 max-md:pb-2.5",
  appsMainHeading: "font-[550] text-[25px] text-foreground max-md:text-[22px]",
  searchAndHeadingContainerFlex:
    "flex justify-between max-md:flex-col max-md:justify-start max-md:gap-[30px]",
  appResultsContainer: "flex flex-wrap w-full overflow-auto gap-[30px] p-5",
  appCard:
    "h-[165px] w-[165px] bg-white dark:bg-card flex justify-center flex-col items-center text-foreground cursor-pointer font-medium rounded-[25px] transition-all border border-border max-md:h-[130px] max-md:w-[130px] hover:shadow-[0_18px_50px_-10px_rgba(51,119,255,0.34)] hover:scale-[1.05]",
  eachAppName:
    "text-sm text-center w-[140px] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden text-ellipsis break-words px-[5px] py-2.5 text-foreground max-md:w-[130px]",
  headingDescription: "text-[15px] text-muted-foreground font-normal pr-5",
  logoOrIconStyles:
    "h-[50px] w-[60px] p-[5px] border border-[#4A8EDF] rounded-lg flex flex-col justify-center items-center text-[#4A8EDF]",
}

export const cardVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}
