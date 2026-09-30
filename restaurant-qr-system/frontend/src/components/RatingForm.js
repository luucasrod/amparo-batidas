import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import * as ratingService from '../services/ratingService';

const RatingForm = ({ onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const currentOrder = useStore((state) => state.currentOrder);
  const customerName = useStore((state) => state.customerName);
  const setError = useStore((state) => state.setError);
  const setSuccess = useStore((state) => state.setSuccess);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Por favor, selecione uma classificação');
      return;
    }

    try {
      setLoading(true);
      await ratingService.createRating(
        currentOrder.id,
        customerName,
        rating,
        comment
      );
      setSuccess('Avaliação enviada com sucesso!');
      onRatingSubmitted && onRatingSubmitted();
    } catch (err) {
      setError('Erro ao enviar avaliação');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rating-form">
      <h2>Avaliar Restaurante</h2>
      <form onSubmit={handleSubmit}>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star ${rating >= star ? 'active' : ''}`}
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          placeholder="Deixe um comentário (opcional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />

        <button
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Enviando...' : 'Enviar Avaliação'}
        </button>
      </form>
    </div>
  );
};

export default RatingForm;
