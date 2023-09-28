import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

// function Counter() {
//   const [count, setCount] = useState(0);
//   //btn.addEventListener('click',function()...)
//   return (
//     <div>
//       <span style={{ fontSize: "40px" }}>{count}</span>
//       <button className="btn btn-large" onClick={() => setCount((c) => c + 1)}>
//         +1
//         {/* Event handling in React done above by OnClick attribute/prop*/}
//       </button>
//     </div>
//   );
// }

function App() {
  // Define State Variable
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);

  useEffect(function () {
    async function getFacts() {
      const { data: Facts, error } = await supabase.from("Facts").select("*");
      // console.log(Facts);
      setFacts(Facts);
    }
    getFacts();
  }, []);
  //it will be rendered first time the component loads [] empty array ensures that this function here actually runs only at the begining. aka DEPENDENCY Array
  // only once as soon as the app component first renders
  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {/* 2. Use State Variable */}
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}
      {/* yaha pe showForm boolean hai jo T / F deta hai toh condition wahi hgya */}
      {/* <NewFactForm />  ab ye upar hi call hojaega*/}
      <main className="main">
        <CategoryFilter />
        <FactList facts={facts} />
        {/* <Counter /> */}
      </main>
    </>
  );
}

function Loader() {
  return <p>Loading...</p>;
}
function Header({ showForm, setShowForm }) {
  const appTitle = "Factopediaaa!";
  return (
    <header className="header">
      <div className="logo">
        <img
          src="logo.png"
          height="68"
          width="68"
          alt="Facts on the Go! logo"
        />
        <h1>{appTitle}</h1>
        {/* these curly braces works just like template strings but without the $ */}
      </div>
      <button
        className="btn btn-large btn-open"
        // 3. Update State Variable
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? "Close" : "Share a Fact!"}
      </button>
    </header>
  );
}

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("http://example.com ");
  const [category, setCategory] = useState("");
  const textLength = text.length;

  // ye wala 200 word limit ko control krne ke lie hai decrease krne ko counter
  //  ab yaha state use ni hua qnki already component re render hora tha setText se.

  function handleSubmit(e) {
    // ye onSubmit me ni ghusaye qnki bade lines of code hain aur ye common good practice hai react me karna.
    // aksar karte hain ye. React will call this function.
    // 1. Prevent Browser Reload
    e.preventDefault();
    // sare eventHandlers ke lie kaam karta hai ye. Page reload ni hoga har baar submit pe
    console.log(text, source, category);
    // 2. Check if data is valid f so,create a new fact
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      //  console.log("valid hai bc");
      // 3. Create a new fact object.
      const newFact = {
        id: Math.round(Math.random() * 10000),
        text: text, //text bhi likhsakte hain better practice
        source,
        category,
        votesInteresting: 0,
        votesMindblowing: 0,
        votesFalse: 0,
        createdIn: new Date().getFullYear(),
      };
      // 4. Add the fact to the UI. add the fact to state so that it renders on the screen
      setFacts((facts) => [newFact, ...facts]);
      // 5. Reset input fields
      setText("");
      setSource("");
      setCategory("");
      // 6 Close the Form.
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the World..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        // ye onClick se alag hai thoda yaha e Event Object hai
      />
      <span>{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy Source..."
        onChange={(e) => setSource(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose category :</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large">Post</button>
    </form>
  );
}

function CategoryFilter() {
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all-categories">All</button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  ); /*bas ye likhne se kaam ni chalega batan pdega place kaha karna hai to thats why
  upar hmne App me <categoryFilter> dala heqader ke baad*/
}

function FactList({ facts }) {
  //destructure kardia props / props.facts ko ({facts}) se
  // Temporary

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the Database. Add your Own!</p>
    </section>
  );
}
function Fact({ fact }) {
  return (
    <li className="fact">
      <p>
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button>👍 {fact.votesInteresting}</button>
        <button>🤯 {fact.votesMindblowing}</button>
        <button>⛔️ {fact.votesFalse}</button>
      </div>
    </li>
  );
}
export default App;
