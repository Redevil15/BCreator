import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="h-full w-full pt-36 relative flex items-center justify-center flex-col">
        {/* Grid */}
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] " />
        <p className="text-center">Run your agency, in one place</p>
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-7xl font-bold text-center md:text-[220px]">
            BCreator
          </h1>
        </div>
        <div className="flex justify-center items-center relative md:mt-[-70px]">
          <Image
            src={'/assets/preview.png'}
            width={1200}
            height={1200}
            alt="Banner image"
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute  z-10">
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center flex-col gap-4 md:!mt-20 mt-[-60px]">
        <h2 className="text-4xl text-center">
          Choose what fits you righ
        </h2>
        <p className="text-muted-foreground text-center">
          Our straightforward pricing plans are tailored to meet your needs. If {"you're"} not <br /> ready to commit, try our free plan.
        </p>
        <div className="flex justify-center gap-4 flex-wrap mt-6">
          {pricingCards.map((card) => (
            // WIP: Wire up free product from stripe
            <Card
              key={card.title}
              className={clsx(
                'w-[300px] flex flex-col justify-between',
                {
                  'border-2 border-primary': card.title === "Unlimited Saas"
                }
              )}
            >
              <CardHeader>
                <CardTitle className={clsx(
                  "",
                  {
                    'text-muted-foreground': card.title !== "Unlimited Saas"
                  }
                )}>
                  {card.title}
                </CardTitle>
                <CardDescription>
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">
                  {card.price}
                </span>
                <span className="text-4xl font-bold">
                  /m
                </span>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  {card.features.map((feature) => {
                    return (
                      <div
                        className="flex gap-2 items-center"
                        key={feature}
                      >
                        <Check className="text-muted-foreground" />
                        <p>{feature}</p>
                      </div>
                    )
                  })}
                </div>
                <Link
                  href={`/agency?plan=${card.priceId}`}
                  className={clsx(
                    "w-full text-center bg-primary p-2 rounded-md",
                    {
                      '!bg-muted-foreground': card.title !== 'Unlimited Saas'
                    }
                  )}
                >
                  Get starter
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
