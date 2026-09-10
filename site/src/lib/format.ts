/**
 * Number formatting shared by server and client components.
 *
 * Lives outside `charts.tsx` because that file is `"use client"`: a server
 * component importing a function from a client module gets a reference it
 * cannot call, not the function itself.
 */

const numbers = new Intl.NumberFormat("en-GB");

export const fmt = (value: number) => numbers.format(value);
