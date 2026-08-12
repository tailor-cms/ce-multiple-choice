<template>
  <div class="tce-multiple-choice">
    <VInput
      v-slot="{ isValid }"
      :model-value="elementData.correct"
      :rules="validation.correct"
    >
      <div class="text-title-small mb-2">{{ title }}</div>
      <VSlideYTransition group>
        <VTextField
          v-for="(answer, index) in elementData.answers"
          :key="index"
          :model-value="answer"
          :placeholder="placeholder"
          :readonly="isReadonly"
          :rules="validation.answer"
          class="my-2 w-100"
          variant="outlined"
          @update:model-value="updateAnswer(index, $event)"
        >
          <template #prepend>
            <VCheckbox
              v-if="isGradable"
              :error="isValid.value === false"
              :model-value="elementData.correct"
              :readonly="isReadonly"
              :value="index"
              color="primary"
              hide-details
              multiple
              @update:model-value="
                emit('update', { correct: $event ?? undefined })
              "
            />
            <VAvatar
              v-else
              class="font-weight-bold ma-1"
              color="surface-container-highest"
              rounded="lg"
              size="small"
            >
              {{ index + 1 }}
            </VAvatar>
          </template>
          <template v-if="!isReadonly && answers.length > 2" #append>
            <VBtn
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
    </VInput>
    <div class="d-flex justify-end mb-4">
      <VBtn
        v-if="!isReadonly"
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
const placeholder = computed(() =>
  isGradable.value ? 'Answer...' : 'Option...',
);
const btnLabel = computed(() =>
  isGradable.value ? 'Add answer' : 'Add option',
);

const validation = computed(() => ({
  answer: [(val: string) => !!val || 'Answer is required'],
  correct: isGradable.value
    ? [(v?: number[]) => !!v?.length || 'Please choose the correct answer(s)']
    : [],
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
