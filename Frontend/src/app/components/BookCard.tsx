import { Card, CardContent, Chip } from '@mui/material';
import { BookOpen, Star } from 'lucide-react';

interface BookCardProps {
  title: string;
  author: string;
  category: string;
  available: boolean;
  rating: number;
  cover?: string;
}

export function BookCard({ title, author, category, available, rating, cover }: BookCardProps) {
  return (
    <Card className="h-full hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        {cover ? (
          <img src={cover} alt={title} className="w-full h-full object-cover" />
        ) : (
          <BookOpen className="w-16 h-16 text-gray-400" />
        )}
        <Chip
          label={available ? 'Disponible' : 'Prestado'}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: available ? '#10b981' : '#ef4444',
            color: 'white',
            fontWeight: 600,
          }}
        />
      </div>
      <CardContent className="space-y-2">
        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600">{author}</p>
        <div className="flex items-center justify-between pt-2">
          <Chip label={category} size="small" variant="outlined" />
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
