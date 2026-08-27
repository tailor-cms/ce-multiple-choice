<template>
  <div class="tce-multiple-choice mb-6">
    <VInput
      v-slot="{ isValid }"
      :rules="[validation.correct]"
      :validation-value="elementData"
      hide-details
    >
      <div class="w-100">
        <div class="text-label-large mb-3">{{ title }}</div>
        <VSlideYTransition group>
          <VTextField
            v-for="(answer, index) in elementData.answers"
            :key="index"
            :model-value="answer"
            :placeholder="placeholder"
            :readonly="isReadonly"
            :rules="[validation.answer]"
            class="my-2 w-100"
            density="comfortable"
            variant="outlined"
            hide-details
            @update:model-value="updateAnswer(index, $event)"
          >
            <template #prepend>
              <VCheckboxBtn
                v-if="isGradable"
                :error="isValid.value === false"
                :model-value="elementData.correct"
                :readonly="isReadonly"
                :value="index"
                class="flex-0-0 mr-1"
                color="secondary"
                density="compact"
                multiple
                @mousedown.stop
                @update:model-value="
                  emit('update', { correct: $event ?? undefined })
                "
              />
              <VAvatar
                v-else
                :text="String(index + 1)"
                class="text-label-medium font-weight-semibold"
                color="surface-container-highest"
                rounded="lg"
                size="small"
              />
            </template>
            <template v-if="!isReadonly" #append>
              <VBtn
                :disabled="answers.length <= 2"
                aria-label="Remove answer"
                density="comfortable"
                icon="mdi-close"
                size="small"
                variant="text"
                @click="removeAnswer(index)"
              />
            </template>
          </VTextField>
        </VSlideYTransition>
      </div>
    </VInput>
    <VInput
      :rules="[validation.correct, validation.answersFilled]"
      :validation-value="elementData"
      hide-details="auto"
      max-errors="2"
    />
    <div v-if="!isReadonly" class="d-flex justify-center mt-2">
      <VBtn
        :text="btnLabel"
        prepend-icon="mdi-plus"
        variant="text"
        @click="addAnswer"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cloneDeep, range, set } from 'lodash-es';
import type {
  Element,
  ElementData,
} from '@tailor-cms/ce-multiple-choice-manifest';
import { computed } from 'vue';

const props = defineProps<{
  element: Element;
  embedElementConfig: any[];
  isDragged: boolean;
  isFocused: boolean;
  isReadonly: boolean;
}>();

const emit = defineEmits<{
  update: [data: Partial<ElementData>];
}>();

const elementData = computed(() => props.element.data);
const isGradable = computed(() => elementData.value.isGradable);
const answers = computed(() => elementData.value.answers);

const title = computed(() =>
  isGradable.value ? 'Select correct answer(s)' : 'Options',
);
const btnLabel = computed(() =>
  isGradable.value ? 'Add answer' : 'Add option',
);

const placeholder = computed(() =>
  isGradable.value ? 'Answer...' : 'Option...',
);

const validation = computed(() => ({
  answer: (val: string) => !!val,
  correct: ({ correct }: ElementData) =>
    !isGradable.value ||
    !!correct?.length ||
    'Please choose the correct answer(s)',
  answersFilled: ({ answers }: ElementData) =>
    answers.every((it) => !!it) ||
    `All ${isGradable.value ? 'answers' : 'options'} are required`,
}));

const addAnswer = () => emit('update', { answers: [...answers.value, ''] });
const updateAnswer = (index: number, value: string) => {
  emit('update', { answers: set(cloneDeep(answers.value), index, value) });
};
const removeAnswer = (answerIndex: number) => {
  const { answers, correct, feedback } = cloneDeep(elementData.value);

  answers.splice(answerIndex, 1);

  if (isGradable.value) {
    const index = correct!.indexOf(answerIndex);
    if (index !== -1) correct!.splice(index, 1);
    correct!.forEach((it, i) => {
      if (it >= answerIndex && correct) {
        correct[i] = it - 1;
      }
    });
  }

  if (feedback) {
    range(answerIndex, answers.length).forEach((it) => {
      feedback[it] = feedback[it + 1];
    });
    delete feedback[answers.length];
  }

  emit('update', { answers, correct, feedback });
};
</script>

<style lang="scss" scoped>
.tce-multiple-choice {
  text-align: left;
}
</style>
