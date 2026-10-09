import { Header } from '../../components/UI/Header'; 

export default function Home() {
  return (
    <main>
      <Header isLoggedIn={false} />
      <hr className="my-10" />
      <Header isLoggedIn={true} userName="Кирилл" />
    </main>
  );
}