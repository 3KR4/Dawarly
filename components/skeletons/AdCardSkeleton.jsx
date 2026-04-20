import Skeleton from "./Skeleton";
import "@/styles/client/skeletons/ad-card-skeleton.css";

export default function AdCardSkeleton() {
  return (
    <div className="ad-card skeleton-card">
      {/* Image */}
      <div className="image-holder">
        <Skeleton className="image element" />
      </div>

      {/* Body */}
      <div className="body">
        <div className="row">
          <Skeleton className="title element text" />
          <Skeleton className="category element text" />
        </div>

        <div className="row">
          <Skeleton className="price element text" />
          <Skeleton className="tag element text" />
        </div>
        <div className="specs">
          <Skeleton className="spec element" />
          <Skeleton className="spec element" />
          <Skeleton className="spec element" />
        </div>

        {/* Footer */}
        <div className="row">
          <Skeleton className="location element text" />
          <Skeleton className="date element text" />
        </div>
      </div>

      {/* Specs */}
    </div>
  );
}
