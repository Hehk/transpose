import { v4 as uuid } from "uuid"

export type ID = string & { __brand: "id" }
const id = () => uuid() as ID

export default id
