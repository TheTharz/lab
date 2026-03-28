import Link from "next/link";

export default function HomePage() {
	return (
		<main className="min-h-screen bg-slate-100 px-6 py-12 text-slate-900">
			<section className="mx-auto flex max-w-3xl flex-col items-start gap-6 rounded-xl bg-white p-8 shadow-sm">
				<h1 className="text-3xl font-bold tracking-tight">Chemistry Lab</h1>
				<p className="text-base leading-relaxed text-slate-700">
					Welcome to the virtual chemistry lab. Start with the cathode ray
					experiment from here.
				</p>
				<Link
					href="/cathode-ray"
					className="rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
				>
					Open Cathode Ray Experiment
				</Link>
			</section>
		</main>
	);
}
