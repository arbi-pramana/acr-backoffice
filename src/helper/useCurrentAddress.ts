/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import cityJson from "../helper/cities.json";
import districtJson from "../helper/districts_with_cityname.json";

const useCurrentAddress = (Form: any, formKYC1: any, formKYC2: any) => {
  // Watch the selected province
  const selectedIdCardProvinceKYC1 = Form.useWatch(
    ["idCardAddress", "state"],
    formKYC1
  );
  // Filter cities based on the selected province
  const filteredIdCardCitiesKYC1 = useMemo(() => {
    return cityJson.filter(
      (city) => city.provinceName === selectedIdCardProvinceKYC1
    );
  }, [selectedIdCardProvinceKYC1]);

  // Watch the selected city
  const selectedIdCardCityKYC1 = Form.useWatch(
    ["idCardAddress", "city"],
    formKYC1
  );
  // Filter cities based on the selected district
  const filteredIdCardDistrictsKYC1 = useMemo(() => {
    return districtJson.filter(
      (city) => city.cityname === selectedIdCardCityKYC1
    );
  }, [selectedIdCardCityKYC1]);

  // Watch the selected district
  const selectedIdCardDistrictKYC1 = Form.useWatch(
    ["idCardAddress", "district"],
    formKYC1
  );

  // ---------------------------
  // Watch the selected province
  const selectedDomicileProvinceKYC1 = Form.useWatch(
    ["domicileAddress", "state"],
    formKYC1
  );
  // Filter cities based on the selected province
  const filteredDomicileCitiesKYC1 = useMemo(() => {
    return cityJson.filter(
      (city) => city.provinceName === selectedDomicileProvinceKYC1
    );
  }, [selectedDomicileProvinceKYC1]);

  // Watch the selected city
  const selectedDomicileCityKYC1 = Form.useWatch(
    ["domicileAddress", "city"],
    formKYC1
  );
  // Filter cities based on the selected district
  const filteredDomicileDistrictsKYC1 = useMemo(() => {
    return districtJson.filter(
      (city) => city.cityname === selectedDomicileCityKYC1
    );
  }, [selectedDomicileCityKYC1]);

  // Watch the selected district
  const selectedDomicileDistrictKYC1 = Form.useWatch(
    ["domicileAddress", "district"],
    formKYC1
  );

  // ---------------------------
  // Watch the selected province
  const selectedEmployerProvinceKYC2 = Form.useWatch(
    ["employerAddress", "state"],
    formKYC2
  );
  // Filter cities based on the selected province
  const filteredEmployerCitiesKYC2 = useMemo(() => {
    return cityJson.filter(
      (city) => city.provinceName === selectedEmployerProvinceKYC2
    );
  }, [selectedEmployerProvinceKYC2]);

  // Watch the selected city
  const selectedEmployerCityKYC2 = Form.useWatch(
    ["employerAddress", "city"],
    formKYC2
  );
  // Filter cities based on the selected district
  const filteredEmployerDistrictsKYC2 = useMemo(() => {
    return districtJson.filter(
      (city) => city.cityname === selectedEmployerCityKYC2
    );
  }, [selectedEmployerCityKYC2]);

  // Watch the selected district
  const selectedEmployerDistrictKYC2 = Form.useWatch(
    ["employerAddress", "district"],
    formKYC2
  );
  return {
    filteredIdCardCitiesKYC1,
    filteredIdCardDistrictsKYC1,
    selectedIdCardProvinceKYC1,
    selectedIdCardCityKYC1,
    selectedIdCardDistrictKYC1,
    filteredDomicileCitiesKYC1,
    filteredDomicileDistrictsKYC1,
    selectedDomicileProvinceKYC1,
    selectedDomicileCityKYC1,
    selectedDomicileDistrictKYC1,
    filteredEmployerCitiesKYC2,
    filteredEmployerDistrictsKYC2,
    selectedEmployerProvinceKYC2,
    selectedEmployerCityKYC2,
    selectedEmployerDistrictKYC2,
  };
};

export default useCurrentAddress;
