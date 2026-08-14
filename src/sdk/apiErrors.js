import * as Network from "expo-network";
import { ToastError, ToastInfo } from "@/sdk/toast";

class Feedback {
  constructor({
    title = "",
    messages = [],
    formMessages = {},
    emit = ToastError,
  }) {
    this.title = title;
    this.messages = messages.join("\n");
    this.formMessages = !!Object.keys(formMessages).length
      ? formMessages
      : null;
    this.dispatch = () => {
      emit(this.messages || this.title);
    };
  }
}

const createOfflineFeedback = ({ notify }) => {
  const feedback = new Feedback({
    title: "Você está offline",
    messages: ["Verifique sua conexão com a internet e tente novamente."],
  });

  if (notify) {
    feedback.dispatch();
  }

  return feedback;
};

const createCanceledFeedback = ({ notify }) => {
  const feedback = new Feedback({
    title: "O servidor demorou para responder.",
    messages: ["Aguarde um momento enquanto reprocessamos sua solicitação."],
  });

  if (notify) {
    feedback.dispatch();
  }

  return feedback;
};

const createInternalServerFeedback = ({ notify }) => {
  const feedback = new Feedback({
    title: "Ops, algo deu errado",
    messages: [
      "Um erro ocorreu no servidor e não conseguimos completar sua solicitação. Tente novamente mais tarde.",
    ],
    emit: ToastError,
  });

  if (notify) {
    feedback.dispatch();
  }

  return feedback;
};

const createNotFoundFeedback = ({ notify }) => {
  const feedback = new Feedback({
    title: "Ops, algo deu errado",
    messages: [
      "O servidor não encontrou o recurso solicitado. Entre em contato com o suporte.",
    ],
  });

  if (notify) {
    feedback.dispatch();
  }

  return feedback;
};

const createServerFeedback = ({ notify, response }) => {
  const keys = Object.keys(response);
  const formMessages = {};

  keys.forEach((key) => {
    let value = response[key];

    if (Array.isArray(value)) {
      formMessages[key] = value.join(", ");
    }

    formMessages[key] = String(value);
  });

  const feedback = new Feedback({
    title: "Erro ao processar a requisição.",
    messages: Object.values(formMessages),
    formMessages,
    emit: ToastError,
  });

  if (notify) {
    feedback.dispatch();
  }

  return feedback;
};

const createGenericFeedback = ({ notify }) => {
  const feedback = new Feedback({
    title: "Ops, algo deu errado",
    messages: [
      "Um erro ocorreu e não conseguimos completar sua solicitação. Tente novamente mais tarde.",
    ],
    emit: ToastInfo,
  });

  if (notify) {
    feedback.dispatch();
  }

  return feedback;
};

export const createFeedback = async ({
  status,
  response,
  notify,
  canceled,
}) => {
  const networkState = await Network.getNetworkStateAsync();
  const isOffline =
    !networkState.isConnected || !networkState.isInternetReachable;

  if (isOffline) {
    return createOfflineFeedback({ notify });
  }

  if (canceled) {
    return createCanceledFeedback({ notify });
  }

  if ([500, 502].includes(status)) {
    return createInternalServerFeedback({ notify });
  }

  if ([404].includes(status)) {
    return createNotFoundFeedback({ notify });
  }

  if ([400, 401].includes(status)) {
    return createServerFeedback({ notify, response });
  }

  return createGenericFeedback({ notify });
};
