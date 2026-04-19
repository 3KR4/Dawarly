import Skeleton from "./Skeleton";
import "@/styles/client/skeletons/ad-card-skeleton.css";

export default function AdCardSkeleton() {
  return (
    <div className="ad-card skeleton-card">
      {/* Image */}
      <div className="image-holder">
        <Skeleton className="image" />
      </div>

      {/* Body */}
      <div className="body">
        <div className="row">
          <Skeleton className="title" />
          <Skeleton className="category" />
        </div>

        <div className="row">
          <Skeleton className="price" />
          <Skeleton className="tag" />
        </div>
      </div>

      {/* Specs */}
      <div className="specs">
        <Skeleton className="spec" />
        <Skeleton className="spec" />
        <Skeleton className="spec" />
      </div>

      {/* Footer */}
      <div className="footer">
        <Skeleton className="location" />
        <Skeleton className="date" />
      </div>
    </div>
  );
}