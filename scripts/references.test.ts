// Tests for reference numbers (BRAND_GUIDE §7).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateReference, referenceFor, REFERENCE_PATTERN } from '../src/shared/references.ts';

test('generateReference: NGT-SL/TKT/INV + 6 digits', () => {
  for (const [kind, prefix] of [['seal', 'NGT-SL-'], ['ticket', 'NGT-TKT-'], ['invoice', 'NGT-INV-']] as const) {
    for (let i = 0; i < 500; i++) {
      const ref = generateReference(kind);
      assert.ok(ref.startsWith(prefix), ref);
      assert.match(ref, REFERENCE_PATTERN);
    }
  }
});

test('referenceFor is stable per seed and well-formed', () => {
  assert.equal(referenceFor('invoice', 'INV-2026-48213'), referenceFor('invoice', 'INV-2026-48213'));
  assert.notEqual(referenceFor('invoice', 'INV-2026-48213'), referenceFor('invoice', 'INV-2026-48214'));
  assert.match(referenceFor('invoice', 'x'), /^NGT-INV-\d{6}$/);
});

test('REFERENCE_PATTERN rejects the old prefix and malformed numbers', () => {
  for (const bad of ['SDL-INV-004091', 'NGT-INV-04091', 'NGT-INV-0040911', 'NGT-XX-004091', 'ngt-inv-004091']) {
    assert.doesNotMatch(bad, REFERENCE_PATTERN);
  }
});
