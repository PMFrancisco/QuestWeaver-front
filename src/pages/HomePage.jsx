import { Button } from "@nextui-org/react";
import React from "react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative h-screen flex items-center justify-center text-center bg-cover bg-hero-pattern">
        <div className="px-4 lg:px-8">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            Bring Your Tabletop Games to Life, Virtually
          </h1>
          <p className="mt-4 text-lg ">
            Experience immersive gaming with friends, anytime, anywhere.
          </p>
          <Button
            as={Link}
            to="/newgame"
            color="primary"
            size="lg"
            className="my-8"
          >
            Get Started
          </Button>
        </div>
      </div>

      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for virtual tabletop gaming
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center px-4 py-6">
                <div className="font-semibold text-lg">
                  Diverse Game Library
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Create your own games and invite your friends.
                </p>
              </div>
              <div className="text-center px-4 py-6">
                <div className="font-semibold text-lg">
                  Wiki Pages for Every Game
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Stay connected with the world and share your progress and
                  adventures.
                </p>
              </div>
              <div className="text-center px-4 py-6">
                <div className="font-semibold text-lg">
                  Intuitive Game Creation Tools
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Easily create and customize your games with drag-and-drop
                  tools in real time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
