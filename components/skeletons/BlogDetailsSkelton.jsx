import Skeleton from "./Skeleton";
import "@/styles/client/skeletons/blog-details-skeleton.css";

export default function BlogDetailsSkelton() {
  return (
    <div className="single-page container for-product">
      <div className="holder big-holder skeleton-details">
        <Skeleton className="main-image element" />

        <div className="details-holder">
          <div className="left">
            <div className="card">
              <Skeleton className="title element text" />
              <Skeleton className="description element text" />
              <Skeleton className="description element text" />
              <Skeleton className="description element text" />
              <Skeleton className="description element text" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
