import { DomainId, Territory } from "../types/world";

export const territories: Territory[] = [
  { id: "components", title: "Vector components & coordinates", shortTitle: "Components", x: 9, y: 56, prerequisiteIds: [], downstreamIds: ["dot-product", "linear-combinations"], domains: ["engineering", "ai", "finance"], status: "available" },
  { id: "magnitude-angle", title: "Magnitude, angle & normalisation", shortTitle: "Magnitude & angle", x: 25, y: 20, prerequisiteIds: ["components"], downstreamIds: ["dot-product", "projection"], domains: ["engineering", "ai"], status: "available" },
  { id: "dot-product", title: "The dot product", shortTitle: "Dot product", notation: "a · b", x: 44, y: 48, prerequisiteIds: ["components", "magnitude-angle"], downstreamIds: ["projection", "orthogonality", "matrices", "gradients"], domains: ["engineering", "ai", "finance", "climate"], status: "available" },
  { id: "linear-combinations", title: "Linear combinations & weighted sums", shortTitle: "Weighted sums", x: 29, y: 82, prerequisiteIds: ["components"], downstreamIds: ["matrices"], domains: ["finance", "ai", "climate"], status: "available" },
  { id: "projection", title: "Projection", shortTitle: "Projection", x: 65, y: 19, prerequisiteIds: ["dot-product"], downstreamIds: ["orthogonality"], domains: ["engineering", "ai"], status: "available" },
  { id: "orthogonality", title: "Orthogonality", shortTitle: "Orthogonality", x: 68, y: 55, prerequisiteIds: ["dot-product"], downstreamIds: ["matrices"], domains: ["engineering", "ai"], status: "available" },
  { id: "matrices", title: "Matrices as systems of dot products", shortTitle: "Matrices", x: 86, y: 76, prerequisiteIds: ["dot-product", "linear-combinations"], downstreamIds: ["gradients"], domains: ["engineering", "ai", "finance"], status: "horizon" },
  { id: "gradients", title: "Gradients: direction of local change", shortTitle: "Gradients", x: 91, y: 31, prerequisiteIds: ["dot-product", "matrices"], downstreamIds: [], domains: ["engineering", "ai", "finance"], status: "horizon" },
];

export const domainJourneys: Record<Exclude<DomainId, "climate">, string[]> = {
  engineering: ["components", "magnitude-angle", "dot-product", "projection", "orthogonality", "matrices", "gradients"],
  ai: ["components", "magnitude-angle", "dot-product", "projection", "matrices", "gradients"],
  finance: ["components", "linear-combinations", "dot-product", "matrices", "gradients"],
};

export const territoryById = (id: string): Territory | undefined => territories.find((territory) => territory.id === id);
