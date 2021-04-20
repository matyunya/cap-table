export default function cn(cond = {}) {
  return Object
    .keys(cond)
    .reduce(
      (acc, classString) => cond[classString] ? acc + " " + classString : acc, ""
    )
}

export const classes = new Set(["dark:text-white","text-black","fixed","h-screen","bg-white","opacity-0","transition","duration-150","z-50","border-l","border-gray-200","dark:border-gray-700","overflow-y-auto","hidden","p-1","select-none","rounded-full","flex","items-center","justify-center","h-4","w-4","mr-2","absolute","m-2","text-red-500","bg-red-100","cursor-pointer","hover:text-white","flex-col","items-end","relative","px-3","mt-4","flex-grow","w-8","z-40","w-full","h-full","overflow-auto","text-gray-600","z-0","bg-gradient-to-r","from-warm-gray-100","dark:from-gray-900","via-gray-200","dark:via-gray-800","to-warm-gray-100","dark:to-warm-gray-800","h-10","z-20","mb-8","justify-start","text-sm","sm:text-xs","font-medium","px-8","pr-1","hover:bg-light-blue-100","hover:text-gray-800","focus:ring-2","w-32","truncate","duration-200","bg-transparent","text-xs","shadow","focus:outline-none","rounded","mr-3","text-light-blue-500","ring-light-blue-200","ring-0","dark:bg-gray-700","dark:text-gray-200","justify-end","outline-none","ring-gray-100","text-base","h-6","w-6","hover:ring-4","duration-500","hover:ring-1","ring-light-blue-500","mx-1","sm:px-1","block","py-24","lg:pt-0","container","mx-auto","px-4","text-center","text-6xl","pt-8","font-bold","tracking-widest","uppercase","mt-8","text-lg","max-w-lg","my-8","max-w-sm","p-4","space-y-2","font-mono","my-2"]);
