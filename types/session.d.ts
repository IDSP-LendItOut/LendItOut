import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    listingData?: {
      type?: string;
      category?: string;
      title?: string;
      description?: string;
      salePrice?: number;
      rentalPrice?: number;
      rentalDuration?: string;
      condition?: string;
      showInOtherAreas?: string;
      delivery?: string;
      payment?: string;
      promote?: string;
      city?: string;
      // Add other fields for other steps here
    };
  }
}
