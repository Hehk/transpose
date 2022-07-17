type State = {
  onChange: (newValue: string) => void
  value: string
}

export default function Input({ onChange, value }: State) {
  return (
    <input
      className="shadow-md w-96 h-12 border-2 border-black focus:border-indigo-500 outline-none p-4 text-lg br-2"
      onChange={(e) => onChange(e.target.value)}
      value={value}
    />
  )
}
