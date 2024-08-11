import {
  FindResultPayload,
  Input,
  InputList,
  ServiceResponse,
  UpdateInputPayload,
} from "../../types";
import { DEFAULT_TEST_API_ENDPOINT } from "./constants";

export async function getAllInputs(): Promise<ServiceResponse<InputList>> {
  return await fetch(`${DEFAULT_TEST_API_ENDPOINT}/input/getall`).then((res) =>
    res.json(),
  );
}

export async function getInputById(
  id: number,
): Promise<ServiceResponse<Input>> {
  return await fetch(`${DEFAULT_TEST_API_ENDPOINT}/input/${id}`).then((res) =>
    res.json(),
  );
}

export async function findResult(input: FindResultPayload) {
  return await fetch(`${DEFAULT_TEST_API_ENDPOINT}/input/findresult`, {
    method: "POST",
    body: JSON.stringify(input),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then((res) => res.json());
}

export async function findResultWithoutSaving(input: FindResultPayload) {
  return await fetch(
    `${DEFAULT_TEST_API_ENDPOINT}/input/findresultwithoutsaving`,
    {
      method: "POST",
      body: JSON.stringify(input),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    },
  ).then((res) => res.json());
}

export async function updateInput(input: UpdateInputPayload) {
  return await fetch(`${DEFAULT_TEST_API_ENDPOINT}/input/updateinput`, {
    method: "PUT",
    body: JSON.stringify(input),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then((res) => res.json());
}

export async function deleteInput(
  id: number,
): Promise<ServiceResponse<string>> {
  return await fetch(`${DEFAULT_TEST_API_ENDPOINT}/input/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
}
