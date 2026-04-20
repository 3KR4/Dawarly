import Skeleton from "./Skeleton";
import "@/styles/client/skeletons/ad-details.css";

export default function AdDetailsSkeleton() {
  return (
    <div className="single-page container for-product">
      <div className="holder big-holder skeleton-details">
        <Skeleton className="title element text" />

        {/* ================= IMAGES ================= */}
        <div className="images-holder">
          <Skeleton className="main-image element" />

          <div className="thumbs">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="thumb element" />
            ))}
          </div>
        </div>

        {/* ================= DETAILS ================= */}

        <div className="details-holder">
          {/* LEFT */}
          <div className="left">
            {/* MAIN CARD */}
            <div className="card">
              <Skeleton className="title element text" />
              <Skeleton className="price element text" />
              <div className="row">
                <Skeleton className="location element text" />
                <Skeleton className="location element text love" />
              </div>

              <div className="row">
                <Skeleton className="stat element text small" />
                <Skeleton className="stat element text small" />
              </div>
            </div>

            {/* SPECS */}
            <div className="card">
              <Skeleton className="section-title element text" />
              <div className="specs">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="spec element" />
                ))}
              </div>
            </div>

            {/* BOOKING */}
            <div className="card">
              <Skeleton className="section-title element text" />
              <Skeleton className="calendar element" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="right">
            <div className="card user">
              <div className="row">
                <Skeleton className="skeleton section-title element text" />
                <Skeleton className="location element text love" />
              </div>
              <div className="row">
                <Skeleton className="stat element text small" />
                <Skeleton className="stat element text small" />
              </div>
              <div className="row">
                <Skeleton className="stat element text btns" />
                <Skeleton className="stat element text btns" />
              </div>
              <Skeleton className="stat element text btn " />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
