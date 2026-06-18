import React from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/index.scss";
import niches from "../data/niches.json";
import portfolioData from "../data/portfolioData.json";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Page content only — the theme wrapper, container, navbar and footer come
// from the persistent layout. pt-28 clears the absolute navbar.
const Niche = () => {
  const { slug } = useParams();
  const niche = niches.find((n) => n.slug === slug);

  if (!niche) {
    return (
      <main className="mx-auto max-w-3xl pt-32 pb-12 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-[0.1rem]">
          Niche not found
        </h1>
        <Link
          to="/"
          state={{ skipIntro: true }}
          className="mt-4 inline-block text-sm uppercase tracking-[0.109375rem] underline"
        >
          Back to portfolio
        </Link>
      </main>
    );
  }

  const related = (niche.relatedProjects || [])
    .map((cn) => portfolioData.find((p) => p.classname === cn))
    .filter(Boolean);

  return (
    <main className="mx-auto max-w-3xl pt-28 pb-12">
      <p className="text-sm uppercase tracking-[0.2rem] text-muted-foreground">
        Niche
      </p>
      <h1 className="mt-2 text-4xl font-bold uppercase tracking-[0.1rem]">
        {niche.title}
      </h1>
      <p className="mt-4 text-xl">{niche.tagline}</p>
      <p className="mt-6 text-base leading-relaxed">{niche.description}</p>

      <h2 className="mt-12 text-lg font-bold uppercase tracking-[0.1rem]">
        What I build
      </h2>
      <ul className="mt-4 space-y-2">
        {niche.highlights.map((h) => (
          <li key={h} className="flex gap-3 text-base leading-relaxed">
            <span aria-hidden>—</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>

      {related.length > 0 && (
        <>
          <h2 className="mt-12 text-lg font-bold uppercase tracking-[0.1rem]">
            Related work
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <Card key={p.classname} className="gap-3">
                <CardHeader className="gap-2">
                  <CardTitle className="text-base font-bold uppercase tracking-wide">
                    {p.header}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {p.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex-wrap gap-3">
                  <Button asChild variant="outline" size="sm">
                    <a href={p.githubLink} target="_blank" rel="noreferrer">
                      Code
                    </a>
                  </Button>
                  {p.applicationLink && (
                    <Button asChild size="sm">
                      <a href={p.applicationLink} target="_blank" rel="noreferrer">
                        Application
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      <div className="mt-16">
        <Link
          to="/"
          state={{ skipIntro: true }}
          className="text-sm uppercase tracking-[0.109375rem] underline"
        >
          ← Back to portfolio
        </Link>
      </div>
    </main>
  );
};

export default Niche;
