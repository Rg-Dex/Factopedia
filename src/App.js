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
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("Facts").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: Facts, error } = await query
          .order("votesInteresting", { ascending: false })
          .limit(1000);
        //console.log(Facts);
        console.log(error);
        if (!error) setFacts(Facts);
        else alert("There was a Problem getting data from the Database!");
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );
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
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
        {/* <Counter /> */}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}
function Header({ showForm, setShowForm }) {
  const appTitle = " Factopedia🔖";
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
  const [isUploading, setIsUploading] = useState(false);

  const textLength = text.length;

  // ye wala 200 word limit ko control krne ke lie hai decrease krne ko counter
  //  ab yaha state use ni hua qnki already component re render hora tha setText se.

  async function handleSubmit(e) {
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
      // const newFact = {
      //   id: Math.round(Math.random() * 10000),
      //   text: text, //text bhi likhsakte hain better practice
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      // 3. Upload a fact to Supabase and receive a new fact object.
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("Facts")
        .insert([{ text, source, category }])
        .select(); //itne ki hi zaruart hai. ID,createdin automatically supabase generate kardeta hai. Votes wale sare ki default value hmne 0 rakhi bhi hui hai supabase me.
      console.log(newFact); // hmne isse dekhlia ki array return karra hai to neeche setFacts me [newFact[0]] likhna hoga
      setIsUploading(false);
      // 4. Add the fact to the UI. add the fact to state so that it renders on the screen
      if (!error) setFacts((facts) => [newFact[0], ...facts]);
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
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy Source..."
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose category :</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
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

function FactList({ facts, setFacts }) {
  //destructure kardia props / props.facts ko ({facts}) se
  // Temporary

  if (facts.length === 0) {
    return (
      <p className="message">
        No facts for this category yet! Create the first one 😃
      </p>
    );
  }
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the Database. Add your Own!</p>
    </section>
  );
}
function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;
  async function handleVote(columnName) {
    //in the function handleVote() for eg, yaha arguments ka man chaha naam desakte hain
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("Facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id) // where id = fact.id.
      .select();
    setIsUpdating(false);

    console.log(updatedFact);
    if (!error)
      setFacts(
        (facts) => facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
        //yaha pe agar update karne wale fact ki id current fact id se same hai toh updatedFact object return karo ni toh rehne do default
      );
    // hmne spread operator ni use kia (...) qnki nya array same length ka banna chaie votes update hone pe bhi 11 facts hain agar to 11 hi rehne chaie.
  }
  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[⛔ DISPUTED]</span> : null}
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
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        {/* yaha pe arrow function ni use kia hmne qnki multiple lines hongi joki upar handleVote me likhenge hm */}
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpdating}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}
export default App;
