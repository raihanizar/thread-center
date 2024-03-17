export const CategoryBtn = ({ isTrending, onClick, isClicked, categoryName }) => {

  return (
    (isTrending
      ? <button onClick={onClick} className={`${isClicked ? "border-amber-600 bg-amber-300" : "border-amber-300 bg-amber-200"} hover:bg-amber-300 px-2 py-1 border rounded-full text-sm`}>{categoryName}</button>
      : <button onClick={onClick} className={`${isClicked ? "border-slate-600 bg-slate-200" : "border-slate-200 bg-slate-50"} hover:bg-slate-200 px-2 py-1 border rounded-full text-sm`}>{categoryName}</button>
    )
  )
}