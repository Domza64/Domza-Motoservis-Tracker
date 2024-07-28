import { addServiceItem } from "../Actions";

export default async function Home() {
  return (
    <form action={addServiceItem}>
      <input type="text" name="title" id="title" />
      <input type="text" name="lastService" id="lastService" />
      <button>submit</button>
    </form>
  );
}
