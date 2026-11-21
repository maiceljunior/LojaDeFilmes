<script setup lang="ts">
import { vMaska } from "maska/vue";
import { computed, nextTick, reactive, ref, watch } from "vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import FormField from "@/components/ui/FormField.vue";
import PosterImage from "@/components/ui/PosterImage.vue";
import { useCartStore } from "@/stores/cart";
import { useUiStore } from "@/stores/ui";
import { checkoutSchema, lookupCep, UFS, type CheckoutForm } from "@/utils/checkout";
import { formatCurrency, moviePrice } from "@/utils/format";

const cart = useCartStore();
const ui = useUiStore();

const form = reactive<CheckoutForm>({
  name: "",
  email: "",
  cpf: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  district: "",
  city: "",
  state: "" as CheckoutForm["state"],
});

type Field = keyof CheckoutForm;
const errors = ref<Partial<Record<Field, string>>>({});
const touched = reactive(new Set<Field>());
const submitting = ref(false);
const cepLoading = ref(false);
const order = ref<{ name: string; total: number; count: number; code: string } | null>(null);

function validate(only?: Field) {
  const result = checkoutSchema.safeParse(form);
  const next: Partial<Record<Field, string>> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as Field;
      next[field] ??= issue.message;
    }
  }
  if (only) {
    errors.value = { ...errors.value, [only]: next[only] };
  } else {
    errors.value = next;
  }
  return result.success;
}

function blur(field: Field) {
  touched.add(field);
  validate(field);
}

// Revalida enquanto a pessoa corrige um campo que já mostrou erro.
watch(form, () => {
  for (const field of touched) validate(field);
});

// Preenche o endereço automaticamente quando o CEP fica completo.
watch(
  () => form.cep.replace(/\D/g, ""),
  async (cep) => {
    if (cep.length !== 8) return;
    cepLoading.value = true;
    try {
      const address = await lookupCep(cep);
      if (!address) {
        errors.value = { ...errors.value, cep: "CEP não encontrado." };
        return;
      }
      form.street = address.street || form.street;
      form.district = address.district || form.district;
      form.city = address.city;
      form.state = address.state as CheckoutForm["state"];
    } catch {
      ui.notify("Não deu para buscar o CEP agora. Preencha o endereço manualmente.", "info");
    } finally {
      cepLoading.value = false;
    }
  },
);

const canSubmit = computed(() => cart.items.length > 0 && !submitting.value);

async function submit() {
  (Object.keys(form) as Field[]).forEach((f) => touched.add(f));
  if (!validate()) {
    ui.notify("Confira os campos destacados.", "error");
    await nextTick();
    document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
    return;
  }
  submitting.value = true;
  await new Promise((r) => setTimeout(r, 900)); // simula o pagamento
  order.value = {
    name: form.name.trim().split(" ")[0] ?? form.name,
    total: cart.total,
    count: cart.count,
    code: Math.random().toString(36).slice(2, 8).toUpperCase(),
  };
  cart.clear();
  submitting.value = false;
}

const inputClass = (field: Field) => [
  "h-12 w-full rounded-xl border bg-panel px-4 text-base outline-none transition placeholder:text-muted/70 focus:bg-panel-2 sm:text-sm",
  errors.value[field] ? "border-brand/70 focus:border-brand" : "border-line focus:border-white/30",
];
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
    <!-- Pedido concluído -->
    <div v-if="order" class="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl bg-panel p-10 text-center">
      <span class="grid size-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
        <AppIcon name="check" :size="32" />
      </span>
      <h1 class="font-display text-4xl tracking-wide">Valeu, {{ order.name }}!</h1>
      <p class="text-white/75">
        Seu pedido <strong class="text-white">#{{ order.code }}</strong> com {{ order.count }}
        {{ order.count === 1 ? "filme" : "filmes" }} foi confirmado. Total de {{ formatCurrency(order.total) }}.
      </p>
      <p class="text-xs text-muted">É um projeto de estudo: nenhuma cobrança foi feita.</p>
      <RouterLink to="/" class="mt-2 rounded-full bg-brand px-6 py-3 font-semibold hover:bg-brand-soft">Voltar para a loja</RouterLink>
    </div>

    <!-- Carrinho vazio -->
    <div v-else-if="!cart.items.length" class="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl bg-panel p-10 text-center">
      <AppIcon name="cart" :size="40" class="text-muted" />
      <h1 class="text-xl font-semibold">Seu carrinho está vazio</h1>
      <p class="text-sm text-muted">Adicione um filme para finalizar a compra.</p>
      <RouterLink to="/" class="rounded-full bg-white px-6 py-3 font-semibold text-ink">Ver filmes</RouterLink>
    </div>

    <template v-else>
      <h1 class="mb-8 font-display text-5xl tracking-wide">Finalizar compra</h1>

      <div class="grid gap-8 lg:grid-cols-[1fr_380px]">
        <form novalidate class="space-y-8" @submit.prevent="submit">
          <fieldset class="space-y-4 rounded-2xl bg-panel/60 p-5 sm:p-6">
            <legend class="mb-2 text-lg font-semibold">Seus dados</legend>
            <FormField id="name" label="Nome completo" :error="errors.name">
              <input id="name" v-model="form.name" autocomplete="name" :class="inputClass('name')" :aria-invalid="!!errors.name" @blur="blur('name')" />
            </FormField>
            <FormField id="email" label="E-mail" :error="errors.email">
              <input id="email" v-model="form.email" type="email" autocomplete="email" inputmode="email" :class="inputClass('email')" :aria-invalid="!!errors.email" @blur="blur('email')" />
            </FormField>
            <div class="grid gap-4 sm:grid-cols-2">
              <FormField id="cpf" label="CPF" :error="errors.cpf">
                <input id="cpf" v-model="form.cpf" v-maska="'###.###.###-##'" inputmode="numeric" placeholder="000.000.000-00" :class="inputClass('cpf')" :aria-invalid="!!errors.cpf" @blur="blur('cpf')" />
              </FormField>
              <FormField id="phone" label="Celular" :error="errors.phone">
                <input id="phone" v-model="form.phone" v-maska="'(##) #####-####'" type="tel" autocomplete="tel-national" placeholder="(00) 00000-0000" :class="inputClass('phone')" :aria-invalid="!!errors.phone" @blur="blur('phone')" />
              </FormField>
            </div>
          </fieldset>

          <fieldset class="space-y-4 rounded-2xl bg-panel/60 p-5 sm:p-6">
            <legend class="mb-2 text-lg font-semibold">Endereço</legend>
            <div class="grid gap-4 sm:grid-cols-[180px_1fr]">
              <FormField id="cep" label="CEP" :error="errors.cep" :hint="cepLoading ? 'Buscando endereço…' : 'Preenche o resto sozinho'">
                <input id="cep" v-model="form.cep" v-maska="'#####-###'" inputmode="numeric" autocomplete="postal-code" placeholder="00000-000" :class="inputClass('cep')" :aria-invalid="!!errors.cep" @blur="blur('cep')" />
              </FormField>
              <FormField id="street" label="Rua" :error="errors.street">
                <input id="street" v-model="form.street" autocomplete="address-line1" :class="inputClass('street')" :aria-invalid="!!errors.street" @blur="blur('street')" />
              </FormField>
            </div>
            <div class="grid gap-4 sm:grid-cols-[140px_1fr]">
              <FormField id="number" label="Número" :error="errors.number">
                <input id="number" v-model="form.number" inputmode="numeric" :class="inputClass('number')" :aria-invalid="!!errors.number" @blur="blur('number')" />
              </FormField>
              <FormField id="district" label="Bairro" :error="errors.district">
                <input id="district" v-model="form.district" :class="inputClass('district')" :aria-invalid="!!errors.district" @blur="blur('district')" />
              </FormField>
            </div>
            <div class="grid gap-4 sm:grid-cols-[1fr_140px]">
              <FormField id="city" label="Cidade" :error="errors.city">
                <input id="city" v-model="form.city" autocomplete="address-level2" :class="inputClass('city')" :aria-invalid="!!errors.city" @blur="blur('city')" />
              </FormField>
              <FormField id="state" label="Estado" :error="errors.state">
                <select id="state" v-model="form.state" autocomplete="address-level1" :class="inputClass('state')" :aria-invalid="!!errors.state" @blur="blur('state')">
                  <option value="" disabled>UF</option>
                  <option v-for="uf in UFS" :key="uf" :value="uf">{{ uf }}</option>
                </select>
              </FormField>
            </div>
          </fieldset>

          <button
            type="submit"
            :disabled="!canSubmit"
            class="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand text-lg font-semibold shadow-lg shadow-brand/30 transition hover:bg-brand-soft disabled:opacity-60 lg:hidden"
          >
            {{ submitting ? "Processando…" : `Pagar ${formatCurrency(cart.total)}` }}
          </button>
        </form>

        <!-- Resumo do pedido -->
        <aside class="h-fit space-y-4 rounded-2xl bg-panel p-5 lg:sticky lg:top-24">
          <h2 class="text-lg font-semibold">Resumo</h2>
          <ul class="max-h-80 space-y-3 overflow-y-auto">
            <li v-for="item in cart.items" :key="item.id" class="flex items-center gap-3">
              <div class="w-12 shrink-0 overflow-hidden rounded-md">
                <PosterImage :path="item.poster_path" :alt="item.title" size="w185" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="line-clamp-1 text-sm font-medium">{{ item.title }}</p>
                <p class="text-xs text-muted">{{ item.quantity }} × {{ formatCurrency(moviePrice(item.vote_average)) }}</p>
              </div>
              <span class="text-sm font-semibold tabular-nums">{{ formatCurrency(moviePrice(item.vote_average) * item.quantity) }}</span>
            </li>
          </ul>
          <div class="flex items-center justify-between border-t border-line pt-4">
            <span class="text-muted">Total</span>
            <span class="text-2xl font-bold tabular-nums">{{ formatCurrency(cart.total) }}</span>
          </div>
          <button
            type="button"
            :disabled="!canSubmit"
            class="hidden h-12 w-full items-center justify-center rounded-full bg-brand font-semibold shadow-lg shadow-brand/30 transition hover:bg-brand-soft disabled:opacity-60 lg:flex"
            @click="submit"
          >
            {{ submitting ? "Processando…" : "Confirmar pedido" }}
          </button>
          <p class="text-center text-xs text-muted">Projeto de estudo: nenhuma cobrança é feita.</p>
        </aside>
      </div>
    </template>
  </div>
</template>
