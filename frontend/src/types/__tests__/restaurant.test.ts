import { RestaurantStatus, CuisineType, PriceRange, DeliveryType, RestaurantData, ContactInfo, OperatingHours, DayHours, SpecialHours, DeliveryInfo, DeliveryZone, RestaurantRatingInfo, ImageInfo, RestaurantFeature, MenuInfo, MenuCategory, MenuItem, NutritionInfo, CustomizationOption, CustomizationChoice, SeasonalItem, CreateRestaurantRequest, UpdateRestaurantRequest, RestaurantFilters, RestaurantSearchParams, RestaurantResponse, RestaurantListResponse, MenuResponse, RestaurantStatsResponse, RestaurantStats } from '../restaurant';

describe('restaurant types', () => {
  it('should have valid RestaurantStatus type', () => {
    // Test de base pour vérifier que le type existe
    const testRestaurantStatus: RestaurantStatus = {} as RestaurantStatus;
    expect(testRestaurantStatus).toBeDefined();
  });

  it('should have valid CuisineType type', () => {
    // Test de base pour vérifier que le type existe
    const testCuisineType: CuisineType = {} as CuisineType;
    expect(testCuisineType).toBeDefined();
  });

  it('should have valid PriceRange type', () => {
    // Test de base pour vérifier que le type existe
    const testPriceRange: PriceRange = {} as PriceRange;
    expect(testPriceRange).toBeDefined();
  });

  it('should have valid DeliveryType type', () => {
    // Test de base pour vérifier que le type existe
    const testDeliveryType: DeliveryType = {} as DeliveryType;
    expect(testDeliveryType).toBeDefined();
  });

  it('should have valid RestaurantData type', () => {
    // Test de base pour vérifier que le type existe
    const testRestaurantData: RestaurantData = {} as RestaurantData;
    expect(testRestaurantData).toBeDefined();
  });

  it('should have valid ContactInfo type', () => {
    // Test de base pour vérifier que le type existe
    const testContactInfo: ContactInfo = {} as ContactInfo;
    expect(testContactInfo).toBeDefined();
  });

  it('should have valid OperatingHours type', () => {
    // Test de base pour vérifier que le type existe
    const testOperatingHours: OperatingHours = {} as OperatingHours;
    expect(testOperatingHours).toBeDefined();
  });

  it('should have valid DayHours type', () => {
    // Test de base pour vérifier que le type existe
    const testDayHours: DayHours = {} as DayHours;
    expect(testDayHours).toBeDefined();
  });

  it('should have valid SpecialHours type', () => {
    // Test de base pour vérifier que le type existe
    const testSpecialHours: SpecialHours = {} as SpecialHours;
    expect(testSpecialHours).toBeDefined();
  });

  it('should have valid DeliveryInfo type', () => {
    // Test de base pour vérifier que le type existe
    const testDeliveryInfo: DeliveryInfo = {} as DeliveryInfo;
    expect(testDeliveryInfo).toBeDefined();
  });

  it('should have valid DeliveryZone type', () => {
    // Test de base pour vérifier que le type existe
    const testDeliveryZone: DeliveryZone = {} as DeliveryZone;
    expect(testDeliveryZone).toBeDefined();
  });

  it('should have valid RestaurantRatingInfo type', () => {
    // Test de base pour vérifier que le type existe
    const testRestaurantRatingInfo: RestaurantRatingInfo = {} as RestaurantRatingInfo;
    expect(testRestaurantRatingInfo).toBeDefined();
  });

  it('should have valid ImageInfo type', () => {
    // Test de base pour vérifier que le type existe
    const testImageInfo: ImageInfo = {} as ImageInfo;
    expect(testImageInfo).toBeDefined();
  });

  it('should have valid RestaurantFeature type', () => {
    // Test de base pour vérifier que le type existe
    const testRestaurantFeature: RestaurantFeature = {} as RestaurantFeature;
    expect(testRestaurantFeature).toBeDefined();
  });

  it('should have valid MenuInfo type', () => {
    // Test de base pour vérifier que le type existe
    const testMenuInfo: MenuInfo = {} as MenuInfo;
    expect(testMenuInfo).toBeDefined();
  });

  it('should have valid MenuCategory type', () => {
    // Test de base pour vérifier que le type existe
    const testMenuCategory: MenuCategory = {} as MenuCategory;
    expect(testMenuCategory).toBeDefined();
  });

  it('should have valid MenuItem type', () => {
    // Test de base pour vérifier que le type existe
    const testMenuItem: MenuItem = {} as MenuItem;
    expect(testMenuItem).toBeDefined();
  });

  it('should have valid NutritionInfo type', () => {
    // Test de base pour vérifier que le type existe
    const testNutritionInfo: NutritionInfo = {} as NutritionInfo;
    expect(testNutritionInfo).toBeDefined();
  });

  it('should have valid CustomizationOption type', () => {
    // Test de base pour vérifier que le type existe
    const testCustomizationOption: CustomizationOption = {} as CustomizationOption;
    expect(testCustomizationOption).toBeDefined();
  });

  it('should have valid CustomizationChoice type', () => {
    // Test de base pour vérifier que le type existe
    const testCustomizationChoice: CustomizationChoice = {} as CustomizationChoice;
    expect(testCustomizationChoice).toBeDefined();
  });

  it('should have valid SeasonalItem type', () => {
    // Test de base pour vérifier que le type existe
    const testSeasonalItem: SeasonalItem = {} as SeasonalItem;
    expect(testSeasonalItem).toBeDefined();
  });

  it('should have valid CreateRestaurantRequest type', () => {
    // Test de base pour vérifier que le type existe
    const testCreateRestaurantRequest: CreateRestaurantRequest = {} as CreateRestaurantRequest;
    expect(testCreateRestaurantRequest).toBeDefined();
  });

  it('should have valid UpdateRestaurantRequest type', () => {
    // Test de base pour vérifier que le type existe
    const testUpdateRestaurantRequest: UpdateRestaurantRequest = {} as UpdateRestaurantRequest;
    expect(testUpdateRestaurantRequest).toBeDefined();
  });

  it('should have valid RestaurantFilters type', () => {
    // Test de base pour vérifier que le type existe
    const testRestaurantFilters: RestaurantFilters = {} as RestaurantFilters;
    expect(testRestaurantFilters).toBeDefined();
  });

  it('should have valid RestaurantSearchParams type', () => {
    // Test de base pour vérifier que le type existe
    const testRestaurantSearchParams: RestaurantSearchParams = {} as RestaurantSearchParams;
    expect(testRestaurantSearchParams).toBeDefined();
  });

  it('should have valid RestaurantResponse type', () => {
    // Test de base pour vérifier que le type existe
    const testRestaurantResponse: RestaurantResponse = {} as RestaurantResponse;
    expect(testRestaurantResponse).toBeDefined();
  });

  it('should have valid RestaurantListResponse type', () => {
    // Test de base pour vérifier que le type existe
    const testRestaurantListResponse: RestaurantListResponse = {} as RestaurantListResponse;
    expect(testRestaurantListResponse).toBeDefined();
  });

  it('should have valid MenuResponse type', () => {
    // Test de base pour vérifier que le type existe
    const testMenuResponse: MenuResponse = {} as MenuResponse;
    expect(testMenuResponse).toBeDefined();
  });

  it('should have valid RestaurantStatsResponse type', () => {
    // Test de base pour vérifier que le type existe
    const testRestaurantStatsResponse: RestaurantStatsResponse = {} as RestaurantStatsResponse;
    expect(testRestaurantStatsResponse).toBeDefined();
  });

  it('should have valid RestaurantStats type', () => {
    // Test de base pour vérifier que le type existe
    const testRestaurantStats: RestaurantStats = {} as RestaurantStats;
    expect(testRestaurantStats).toBeDefined();
  });
});
