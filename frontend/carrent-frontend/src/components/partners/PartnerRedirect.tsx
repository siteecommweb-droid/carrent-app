export default function PartnerRedirect({ partner, url }: any) {
  function go() {
    window.open(url, "_blank");
  }

  return (
    <div
      onClick={go}
      className="cursor-pointer border p-4 rounded-xl hover:shadow-lg"
    >
      <div>{partner}</div>
    </div>
  );
}
